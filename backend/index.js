require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "https://avenger-web.netlify.app",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

// ------------------ MONGO CONNECTION -------------------
const client = new MongoClient(process.env.MONGO_URI);
let usersCollection, transactionsCollection, otpsCollection;

async function connectDB() {
  await client.connect();
  const db = client.db("paymentDB"); // change DB name if needed
  usersCollection = db.collection("users");
  transactionsCollection = db.collection("transactions");
  otpsCollection = db.collection("pendingOtps");
  console.log("✅ Connected to MongoDB");
}
connectDB().catch(console.error);

// ------------------ EMAIL SETUP -------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: "avengerproject658@gmail.com",
    to,
    subject: "Your Payment OTP",
    text: `Your OTP for payment is: ${otp}. It is valid for 5 minutes.`,
  };
  return transporter.sendMail(mailOptions);
}

// ------------------ ROUTES -------------------

// Health check
app.get("/", (req, res) => res.json({ message: "Dummy Payment API is running" }));

// ------------------ ACCOUNT -------------------
app.post("/create-account", async (req, res) => {
  const { userId, name, email, initialBalance } = req.body;
  if (!userId || !name || !email) {
    return res.status(400).json({ message: "userId, name, and email are required" });
  }

  const existingUser = await usersCollection.findOne({ userId });
  if (existingUser) {
    return res.status(400).json({ message: "Account already exists for this userId", user: existingUser });
  }

  const upiId = `${name.replace(/\s+/g, '').toLowerCase()}@dummyupi`;
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  const user = { userId, name, email, upiId, accountNumber, balance: initialBalance || 0 };

  await usersCollection.insertOne(user);
  res.json({ message: "Account created", user });
});

// ------------------ OTP-BASED PAYMENT -------------------

// Step 1: Request OTP
app.post("/request-otp", async (req, res) => {
  const { fromUpi, toUpi, amount } = req.body;

  const sender = await usersCollection.findOne({ upiId: fromUpi });
  const receiver = await usersCollection.findOne({ upiId: toUpi });

  if (!sender || !receiver) return res.status(400).json({ message: "Invalid sender or receiver" });
  if (amount <= 0) return res.status(400).json({ message: "Amount must be > 0" });
  if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  await otpsCollection.updateOne(
    { fromUpi },
    { $set: { otp, fromUpi, toUpi, amount, expiresAt: Date.now() + 5 * 60 * 1000 } },
    { upsert: true }
  );

  try {
    await sendOtpEmail(sender.email, otp);
    res.json({ message: `OTP sent to ${sender.email}` });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// Step 2: Verify OTP and make payment
app.post("/verify-otp", async (req, res) => {
  const { fromUpi, otp } = req.body;
  const pending = await otpsCollection.findOne({ fromUpi });

  if (!pending || pending.otp != otp) {
    return res.status(400).json({ message: "No OTP request found for this UPI" });
  }

  if (Date.now() > pending.expiresAt) {
    await otpsCollection.deleteOne({ fromUpi });
    return res.status(400).json({ message: "OTP expired" });
  }

  const sender = await usersCollection.findOne({ upiId: pending.fromUpi });
  const receiver = await usersCollection.findOne({ upiId: pending.toUpi });

  if (!sender || sender.balance < pending.amount) {
    await otpsCollection.deleteOne({ fromUpi });
    return res.status(400).json({ message: "Insufficient balance or invalid UPI" });
  }

  // Transfer funds
  await usersCollection.updateOne({ upiId: sender.upiId }, { $inc: { balance: -pending.amount } });
  await usersCollection.updateOne({ upiId: receiver.upiId }, { $inc: { balance: pending.amount } });

  await transactionsCollection.insertOne({
    fromName: sender.name,
    toName: receiver.name,
    from: sender.userId,
    to: receiver.userId,
    amount: pending.amount,
    date: new Date()
  });

  await otpsCollection.deleteOne({ fromUpi });
  res.json({ message: "Payment successful via OTP" });
});

// ------------------ BALANCE & TRANSACTIONS -------------------
app.get("/balance/:upiId", async (req, res) => {
  const user = await usersCollection.findOne({ upiId: req.params.upiId });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ balance: user.balance });
});

app.get("/transactions/:userId", async (req, res) => {
  const userTx = await transactionsCollection.find({
    $or: [{ from: req.params.userId }, { to: req.params.userId }]
  }).toArray();
  res.json({ transactions: userTx });
});

app.get("/user/:userId", async (req, res) => {
  const user = await usersCollection.findOne({ userId: req.params.userId });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

// ------------------ FORCE TRANSFER -------------------
app.post("/force-transfer", async (req, res) => {
  const { toUpi, amount } = req.body;

  if (!toUpi || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "toUpi and valid amount are required" });
  }

  const receiver = await usersCollection.findOne({ upiId: toUpi });
  if (!receiver) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  await usersCollection.updateOne({ upiId: toUpi }, { $inc: { balance: amount } });

  await transactionsCollection.insertOne({
    from: "SYSTEM",
    fromName: "SYSTEM",
    toName: receiver.name,
    to: receiver.userId,
    amount,
    date: new Date()
  });

  res.json({
    message: `Force transfer of ₹${amount} to ${receiver.name} successful.`,
    receiver
  });
});

// ------------------ UPDATE BALANCE -------------------
app.post("/update-balance", async (req, res) => {
  const { userId, upiId, amount } = req.body;

  if (!userId && !upiId) {
    return res.status(400).json({ message: "Provide either userId or upiId" });
  }
  if (typeof amount !== "number") {
    return res.status(400).json({ message: "Amount must be a number" });
  }

  const query = userId ? { userId } : { upiId };
  const user = await usersCollection.findOne(query);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await usersCollection.updateOne(query, { $inc: { balance: amount } });

  await transactionsCollection.insertOne({
    from: amount < 0 ? user.userId : "SYSTEM",
    to: amount > 0 ? user.userId : "SYSTEM",
    amount: Math.abs(amount),
    date: new Date()
  });

  const updatedUser = await usersCollection.findOne(query);
  res.json({
    message: `Balance updated for ${user.name}`,
    newBalance: updatedUser.balance
  });
});

app.get("/all-transactions", async (req, res) => {
  const tx = await transactionsCollection.find().toArray();
  res.json({ transactions: tx });
});

// ------------------ ATTENDANCE OTPs -------------------
app.post("/send-attendance-otps", async (req, res) => {
  const { otps } = req.body;

  const sendEmailPromises = Object.values(otps).map(({ email, otp }) => {
    const mailOptions = {
      from: "avengerproject658@gmail.com",
      to: email,
      subject: "Your Attendance OTP",
      text: `Your OTP for attendance is: ${otp}. It expires in 1 minute.`,
    };
    return transporter.sendMail(mailOptions);
  });

  try {
    await Promise.all(sendEmailPromises);
    res.json({ message: "Attendance OTPs sent" });
  } catch (error) {
    console.error("Failed to send OTPs:", error);
    res.status(500).json({ message: "Error sending OTPs" });
  }
});

// ------------------ ANNOUNCEMENTS -------------------
app.post("/send-announcement", async (req, res) => {
  const { title, body, recipients } = req.body;

  if (!title || !body || !recipients || !Array.isArray(recipients)) {
    return res.status(400).json({ message: "title, body and recipients array are required" });
  }

  const sendEmailPromises = recipients.map((email) => {
    const mailOptions = {
      from: "avengerproject658@gmail.com",
      to: email,
      subject: `📢 New Announcement: ${title}`,
      text: `${body}\n\n- Avengers Team`
    };
    return transporter.sendMail(mailOptions);
  });

  try {
    await Promise.all(sendEmailPromises);
    res.json({ message: "Announcement emails sent successfully" });
  } catch (error) {
    console.error("Failed to send announcement emails:", error);
    res.status(500).json({ message: "Error sending announcement emails" });
  }
});

// ------------------ START SERVER -------------------
app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
