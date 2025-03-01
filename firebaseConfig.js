const admin = require("firebase-admin");
const serviceAccount = require("/Users/thotavinay/Desktop/sentimind/firebase/sentimind1-df6c2-firebase-adminsdk-fbsvc-c6d16a58bb.json"); // Load your credentials

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https:/sentimind1-df6c2.firebaseio.com"
});

const db = admin.firestore();
module.exports = db;
