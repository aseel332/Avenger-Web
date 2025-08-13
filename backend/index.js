const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
const db = require("./firebase"); // Firestore connection

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "https://avenger-web.netlify.app",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

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
app.get("/", (req, res) => res.json({ message: "Dummy Payment API is running" }));

// ------------------ ACCOUNT -------------------
app.post("/create-account", async (req, res) => {
  const { userId, name, email, initialBalance } = req.body;
  if (!userId || !name || !email) {
    return res.status(400).json({ message: "userId, name, and email are required" });
  }

  const existingUser = await db.collection("accounts").doc(userId).get();
  if (existingUser.exists) {
    return res.status(400).json({ message: "Account already exists for this userId", user: existingUser.data() });
  }

  const upiId = `${(name.replace(/\s+/g, '')).toLowerCase()}@dummyupi`;
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  const user = { userId, name, email, upiId, accountNumber, balance: initialBalance || 0 };

  await db.collection("accounts").doc(userId).set(user);
  res.json({ message: "Account created", user });
});

// ------------------ OTP-BASED PAYMENT -------------------
app.post("/request-otp", async (req, res) => {
  const { fromUpi, toUpi, amount } = req.body;

  const senderSnapshot = await db.collection("accounts").where("upiId", "==", fromUpi).limit(1).get();
  const receiverSnapshot = await db.collection("accounts").where("upiId", "==", toUpi).limit(1).get();

  if (senderSnapshot.empty || receiverSnapshot.empty) {
    return res.status(400).json({ message: "Invalid sender or receiver" });
  }

  const sender = senderSnapshot.docs[0].data();

  if (amount <= 0) return res.status(400).json({ message: "Amount must be > 0" });
  if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  await db.collection("pendingOtps").doc(fromUpi).set({
    otp,
    fromUpi,
    toUpi,
    amount,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  try {
    await sendOtpEmail(sender.email, otp);
    res.json({ message: `OTP sent to ${sender.email}` });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { fromUpi, otp } = req.body;
  const pendingDoc = await db.collection("pendingOtps").doc(fromUpi).get();

  if (!pendingDoc.exists || pendingDoc.data().otp != otp) {
    return res.status(400).json({ message: "No OTP request found for this UPI" });
  }

  const pending = pendingDoc.data();
  if (Date.now() > pending.expiresAt) {
    await db.collection("pendingOtps").doc(fromUpi).delete();
    return res.status(400).json({ message: "OTP expired" });
  }

  const senderSnap = await db.collection("accounts").where("upiId", "==", pending.fromUpi).limit(1).get();
  const receiverSnap = await db.collection("accounts").where("upiId", "==", pending.toUpi).limit(1).get();

  if (senderSnap.empty || receiverSnap.empty) {
    await db.collection("pendingOtps").doc(fromUpi).delete();
    return res.status(400).json({ message: "Invalid UPI" });
  }

  const senderRef = senderSnap.docs[0].ref;
  const receiverRef = receiverSnap.docs[0].ref;
  const sender = senderSnap.docs[0].data();
  const receiver = receiverSnap.docs[0].data();

  if (sender.balance < pending.amount) {
    await db.collection("pendingOtps").doc(fromUpi).delete();
    return res.status(400).json({ message: "Insufficient balance" });
  }

  await senderRef.update({ balance: sender.balance - pending.amount });
  await receiverRef.update({ balance: receiver.balance + pending.amount });

  await db.collection("transactions").add({
    fromName: sender.name,
    toName: receiver.name,
    from: sender.userId,
    to: receiver.userId,
    amount: pending.amount,
    date: new Date()
  });

  await db.collection("pendingOtps").doc(fromUpi).delete();
  res.json({ message: "Payment successful via OTP" });
});

// ------------------ BALANCE & TRANSACTIONS -------------------
app.get("/balance/:upiId", async (req, res) => {
  const userSnap = await db.collection("accounts").where("upiId", "==", req.params.upiId).limit(1).get();
  if (userSnap.empty) return res.status(404).json({ message: "User not found" });
  res.json({ balance: userSnap.docs[0].data().balance });
});

app.get("/transactions/:userId", async (req, res) => {
  const fromSnap = await db.collection("transactions").where("from", "==", req.params.userId).get();
  const toSnap = await db.collection("transactions").where("to", "==", req.params.userId).get();

  const transactions = [
    ...fromSnap.docs.map(d => d.data()),
    ...toSnap.docs.map(d => d.data())
  ];

  res.json({ transactions });
});

app.get("/user/:userId", async (req, res) => {
  const doc = await db.collection("accounts").doc(req.params.userId).get();
  if (!doc.exists) return res.status(404).json({ message: "User not found" });
  res.json({ user: doc.data() });
});

// ------------------ FORCE TRANSFER -------------------
app.post("/force-transfer", async (req, res) => {
  const { toUpi, amount } = req.body;

  if (!toUpi || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "toUpi and valid amount are required" });
  }

  const receiverSnap = await db.collection("accounts").where("upiId", "==", toUpi).limit(1).get();
  if (receiverSnap.empty) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  const receiverRef = receiverSnap.docs[0].ref;
  const receiver = receiverSnap.docs[0].data();

  await receiverRef.update({ balance: receiver.balance + amount });

  await db.collection("transactions").add({
    from: "SYSTEM",
    fromName: "SYSTEM",
    toName: receiver.name,
    to: receiver.userId,
    amount,
    date: new Date()
  });

  res.json({
    message: `Force transfer of ₹${amount} to ${receiver.name} successful.`,
    receiver: { ...receiver, balance: receiver.balance + amount }
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

  let userSnap;
  if (userId) {
    userSnap = await db.collection("accounts").doc(userId).get();
    if (!userSnap.exists) return res.status(404).json({ message: "User not found" });
  } else {
    const querySnap = await db.collection("accounts").where("upiId", "==", upiId).limit(1).get();
    if (querySnap.empty) return res.status(404).json({ message: "User not found" });
    userSnap = querySnap.docs[0];
  }

  const userRef = userId ? db.collection("accounts").doc(userId) : userSnap.ref;
  const userData = userSnap.data();

  await userRef.update({ balance: userData.balance + amount });

  await db.collection("transactions").add({
    from: amount < 0 ? userData.userId : "SYSTEM",
    to: amount > 0 ? userData.userId : "SYSTEM",
    amount: Math.abs(amount),
    date: new Date()
  });

  res.json({
    message: `Balance updated for ${userData.name}`,
    newBalance: userData.balance + amount
  });
});

// ------------------ ALL TRANSACTIONS -------------------
app.get("/all-transactions", async (req, res) => {
  const allTxSnap = await db.collection("transactions").get();
  const transactions = allTxSnap.docs.map(d => d.data());
  res.json({ transactions });
});

// ------------------ SEND ATTENDANCE OTPS -------------------
app.post("/send-attendance-otps", async (req, res) => {
  const { otps } = req.body; // { avengerId: { email, otp }, ... }

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

// ------------------ SEND ANNOUNCEMENTS -------------------
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
