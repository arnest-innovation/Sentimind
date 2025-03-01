import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "/Users/thotavinay/Desktop/sentimind/firebase/sentimind1-df6c2-firebase-adminsdk-fbsvc-c6d16a58bb.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function updateProductDates() {
  const productsRef = db.collection("products");
  const snapshot = await productsRef.get();
  const batch = db.batch();

  snapshot.forEach((doc) => {
    const productRef = productsRef.doc(doc.id);
    batch.update(productRef, { date: "2025-01-01" });
  });

  await batch.commit();
  console.log("All product dates updated to January 2025!");
}

// updateProductDates();

async function updateReviewDates() {
  const productsRef = db.collection("products");
  const snapshot = await productsRef.get();
  const batch = db.batch();

  for (const doc of snapshot.docs) {
    const productRef = productsRef.doc(doc.id);
    // batch.update(productRef, { date: "2025-01-01" });

    const reviewsRef = productRef.collection("reviews");
    const reviewsSnapshot = await reviewsRef.get();

    reviewsSnapshot.forEach((reviewDoc) => {
      const reviewRef = reviewsRef.doc(reviewDoc.id);
      batch.update(reviewRef, { timestamp: "2025-01-01" });
    });
  }

  await batch.commit();
  console.log("All product dates and review timestamps updated to January 2025!");
}

updateReviewDates();