const admin = require("firebase-admin");
const functions = require("firebase-functions");

var serviceAccount = require("../firebase/sentimind1-df6c2-firebase-adminsdk-fbsvc-c6d16a58bb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.summerization = functions.https.onRequest(async (req, res) => {
  const { product_id } = req.body;

  const db = admin.firestore();
  const reviewsRef = db
    .collection("products")
    .doc(product_id)
    .collection("reviews");

  const data = await reviewsRef.get();
  console.log(data.docs[0].data());

  res.send("Hello from Firebase!");
});
