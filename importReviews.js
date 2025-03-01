const admin = require("firebase-admin");
const xlsx = require("xlsx");
const { DateTime } = require("luxon");

// Initialize Firebase
const serviceAccount = require("/Users/thotavinay/Desktop/sentimind/firebase/sentimind1-df6c2-firebase-adminsdk-fbsvc-c6d16a58bb.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load the Excel file
const workbook = xlsx.readFile("sentimind1.xlsx");
const sheetName = workbook.SheetNames[0]; // Read the first sheet
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

async function importData() {
  const limitedData = data.slice(0, 100); // Limit to 100 records

  for (const row of limitedData) {
  
    const { ProductId, Score, Time, Summary, Text } = row;

    // Convert Unix timestamp to YYYY-MM-DD
    const timestamp = DateTime.fromSeconds(parseInt(Time)).toFormat("yyyy-MM-dd");
    console.log(timestamp);

    // Reference to product document
    const productRef = db.collection("products").doc(ProductId);

    // Create product if it doesn't exist
    await productRef.set({ name: `Product ${ProductId}`, date: timestamp }, { merge: true });

    // Add review as a subcollection
    const reviewRef = productRef.collection("reviews").doc();
    await reviewRef.set({
      score: parseInt(Score),
      reviewText: Text,
      summary: Summary,
      timestamp: timestamp,
    });

    console.log(`Imported review for product ${ProductId}`);
}

  console.log("Excel import (100 records) completed!");
}

