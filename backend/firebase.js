const admin = require("firebase-admin");

const serviceAccount = require("./avenger-canvas-firebase-adminsdk-fbsvc-038deb9a19.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
