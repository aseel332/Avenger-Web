require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "https://avenger-web.netlify.app",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

// ------------------ DATABASE CONNECTION -------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ------------------ SCHEMAS -------------------
const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  upiId: String,
  accountNumber: Number,
  balance: Number
});

const transactionSchema = new mongoose.Schema({
  fromName: String,
  toName: String,
  from: String,
  to: String,
  amount: Number,
  date: Date
});

const otpSchema = new mongoose.Schema({
  fromUpi: String,
  toUpi: String,
  otp: Number,
  amount: Number,
  expiresAt: Number
});

const User = mongoose.model("User", userSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const PendingOtp = mongoose.model("PendingOtp", otpSchema);

// ------------------ EMAIL TRANSPORT -------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Payment OTP",
    text: `Your OTP for payment is: ${otp}. It is valid for 5 minutes.`,
  };
  return transporter.sendMail(mailOptions);
}

// ------------------ ROUTES -------------------

// Health check
app.get("/", (req, res) => res.json({ message: "Dummy Payment API is running with MongoDB" }));

// Create account
app.post("/create-account", async (req, res) => {
  const { userId, name, email, initialBalance } = req.body;
  if (!userId || !name || !email) return res.status(400).json({ message: "Missing fields" });

  const existing = await User.findOne({ userId });
  if (existing) return res.status(400).json({ message: "Account already exists", user: existing });

  const upiId = `${name.replace(/\s+/g, '').toLowerCase()}@dummyupi`;
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  const user = new User({ userId, name, email, upiId, accountNumber, balance: initialBalance || 0 });

  await user.save();
  res.json({ message: "Account created", user });
});

// Request OTP
app.post("/request-otp", async (req, res) => {
  const { fromUpi, toUpi, amount } = req.body;

  const sender = await User.findOne({ upiId: fromUpi });
  const receiver = await User.findOne({ upiId: toUpi });

  if (!sender || !receiver) return res.status(400).json({ message: "Invalid sender or receiver" });
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
  if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  await PendingOtp.findOneAndUpdate(
    { fromUpi },
    { fromUpi, toUpi, otp, amount, expiresAt: Date.now() + 5 * 60 * 1000 },
    { upsert: true }
  );

  try {
    await sendOtpEmail(sender.email, otp);
    res.json({ message: `OTP sent to ${sender.email}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP & payment
app.post("/verify-otp", async (req, res) => {
  const { fromUpi, otp } = req.body;
  const pending = await PendingOtp.findOne({ fromUpi });

  if (!pending || pending.otp != otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > pending.expiresAt) {
    await PendingOtp.deleteOne({ fromUpi });
    return res.status(400).json({ message: "OTP expired" });
  }

  const sender = await User.findOne({ upiId: pending.fromUpi });
  const receiver = await User.findOne({ upiId: pending.toUpi });

  if (!sender || sender.balance < pending.amount) {
    await PendingOtp.deleteOne({ fromUpi });
    return res.status(400).json({ message: "Insufficient balance" });
  }

  sender.balance -= pending.amount;
  receiver.balance += pending.amount;

  await sender.save();
  await receiver.save();
  await new Transaction({
    fromName: sender.name, toName: receiver.name,
    from: sender.userId, to: receiver.userId,
    amount: pending.amount, date: new Date()
  }).save();

  await PendingOtp.deleteOne({ fromUpi });
  res.json({ message: "Payment successful", sender, receiver });
});

// Balance
app.get("/balance/:upiId", async (req, res) => {
  const user = await User.findOne({ upiId: req.params.upiId });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ balance: user.balance });
});

// Transactions
app.get("/transactions/:userId", async (req, res) => {
  const tx = await Transaction.find({ $or: [{ from: req.params.userId }, { to: req.params.userId }] });
  res.json({ transactions: tx });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

