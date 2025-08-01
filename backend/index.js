const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

// ------------------ FILE STORAGE -------------------
const dataDir = "./data";
const usersFile = `${dataDir}/users.json`;
const transactionsFile = `${dataDir}/transactions.json`;
const otpFile = `${dataDir}/pendingOtps.json`;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'avengerproject658@gmail.com',
        pass: 'qwje kvdx cerk wbpt'
    }
});

// Ensure data folder exists
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// Helper functions
function loadData(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: "avengerproject658@gmail.com",
    to,
    subject: "Your Payment OTP",
    text: `Your OTP for payment is: ${otp}. It is valid for 5 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

// Load data
let users = loadData(usersFile);
let transactions = loadData(transactionsFile);
let pendingOtps = loadData(otpFile);

// Save users and transactions periodically
setInterval(() => {
  saveData(usersFile, users);
  saveData(transactionsFile, transactions);
}, 10000);

// ------------------ ROUTES -------------------

// Health check
app.get("/", (req, res) => res.json({ message: "Dummy Payment API is running" }));

// ------------------ ACCOUNT -------------------
app.post("/create-account", (req, res) => {
  const { userId, name, email, initialBalance } = req.body;
  if (!userId || !name || !email) {
    return res.status(400).json({ message: "userId, name, and email are required" });
  }

  const existingUser = users.find(u => u.userId === userId);
  if (existingUser) {
    return res.status(400).json({ message: "Account already exists for this userId", user: existingUser });
  }

  const upiId = `${name.toLowerCase()}@dummyupi`;
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  const user = { userId, name, email, upiId, accountNumber, balance: initialBalance || 0 };
  users.push(user);
  saveData(usersFile, users);

  res.json({ message: "Account created", user });
});

// ------------------ OTP-BASED PAYMENT -------------------

// Step 1: Request OTP
app.post("/request-otp", async (req, res) => {
  const { fromUpi, toUpi, amount } = req.body;

  const sender = users.find(u => u.upiId === fromUpi);
  const receiver = users.find(u => u.upiId === toUpi);

  if (!sender || !receiver) return res.status(400).json({ message: "Invalid sender or receiver" });
  if (amount <= 0) return res.status(400).json({ message: "Amount must be > 0" });
  if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  pendingOtps[fromUpi] = { otp, fromUpi, toUpi, amount, expiresAt: Date.now() + 5 * 60 * 1000 };


  fs.writeFileSync(otpFile, JSON.stringify(pendingOtps, null, 2));

  try {
    await sendOtpEmail(sender.email, otp);
    res.json({ message: `OTP sent to ${sender.email}` });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// Step 2: Verify OTP and make payment
app.post("/verify-otp", (req, res) => {
  const { fromUpi, otp } = req.body;
  const pending = pendingOtps[fromUpi];

  if (!pending || pending.otp != otp) {
    return res.status(400).json({ message: "No OTP request found for this UPI" });
  }

  // Check expiration
  if (Date.now() > pending.expiresAt) {
    delete pendingOtps[fromUpi];
    return res.status(400).json({ message: "OTP expired" });
  }

  const sender = users.find(u => u.upiId === pending.fromUpi);
  const receiver = users.find(u => u.upiId === pending.toUpi);

  if (!sender || sender.balance < pending.amount) {
    delete pendingOtps[fromUpi];
    return res.status(400).json({ message: "Insufficient balance or invalid UPI" });
  }

  // Transfer funds
  sender.balance -= pending.amount;
  receiver.balance += pending.amount;

  transactions.push({ from: sender.userId, to: receiver.userId, amount: pending.amount, date: new Date() });

  delete pendingOtps[fromUpi];
  fs.writeFileSync(otpFile, JSON.stringify(pendingOtps, null, 2));
  saveData(usersFile, users);
  saveData(transactionsFile, transactions);

  res.json({ message: "Payment successful via OTP", sender, receiver });
});

// ------------------ BALANCE & TRANSACTIONS -------------------
app.get("/balance/:upiId", (req, res) => {
  const user = users.find(u => u.upiId === req.params.upiId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ balance: user.balance });
});

app.get("/transactions/:userId", (req, res) => {
  const userTx = transactions.filter(tx => tx.from === req.params.userId || tx.to === req.params.userId);
  res.json({ transactions: userTx });
});

app.get("/user/:userId", (req, res) => {
  const user = users.find(u => u.userId === req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

// ------------------ START SERVER -------------------
app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
