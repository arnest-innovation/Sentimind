const db = require("./firebaseConfig"); // Import Firebase
// Add a review
db.collection("products").doc("productID").set({
    name: "Product Name",
    date: "2025-03-01"
  });
  