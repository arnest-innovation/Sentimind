const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

module.exports.summarization = functions.https.onRequest(async (req, res) => {
  try {
    const { product_id, timeRange } = req.body;

    if (!product_id || !timeRange) {
      return res.status(400).send("Missing required parameters: product_id or timeRange");
    }

    // Get today's date in "YYYY-MM-DD" format
    const now = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0]; 

    let startDate;

    switch (timeRange) {
      case "today":
        startDate = formatDate(now);
        break;
      case "yesterday":
        now.setDate(now.getDate() - 1);
        startDate = formatDate(now);
        break;
      case "one_month":
        now.setMonth(now.getMonth() - 1);
        startDate = formatDate(now);
        break;
      case "two_months":
          now.setMonth(now.getMonth() - 2);
          startDate = formatDate(now);
          break;
      case "three_months":
        now.setMonth(now.getMonth() - 3);
        startDate = formatDate(now);
        break;
      case "six_months":
        now.setMonth(now.getMonth() - 6);
        startDate = formatDate(now);
        break;
      default:
        return res.status(400).send("Invalid time range");
    }

    console.log(`Fetching reviews for product ${product_id} from ${startDate} `);

    // Query Firestore reviews subcollection with string-based timestamp filtering
    const reviewsRef = db
      .collection("products")
      .doc(product_id)
      .collection("reviews")
      .where("timestamp", ">=", startDate);


    const snapshot = await reviewsRef.get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "No reviews found for this time range" });
    }

    const cleanText = (text) => {
      return text
        .replace(/<[^>]+>/g, "")  // Remove HTML tags
        .replace(/[\r\n]+/g, " ") // Replace new lines with spaces
        .replace(/&\w+;/g, "")    // Remove HTML entities like &nbsp;
        .trim();                  // Trim extra spaces
    };

    // Get and clean reviews
    const reviews = snapshot.docs
      .map(doc => cleanText(doc.data().reviewText))
      .join(" ")
      .substring(0, 1000); // Limit to 1000 characters

      const requestData = {
        model: "deepseek-r1:1.5b",
        prompt: `Generate a structured summary of customer reviews, highlighting key praised features in a professional tone. Extract relevant #hashtags and list aspects that could be improved. Format the response as follows:
      
      **Customers say**  
      [Summarized customer feedback in 3-4 lines]  
      
      ✔ Feature 1 | ✔ Feature 2 | ✔ Feature 3  
      
      
      Customer feedback for improvement: [List 1-2 areas for improvement]  
      
      Reviews: ${reviews}`,
        max_tokens: 100,
        temperature: 0.1,
        stream: true,
      };
      
    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      requestData,
      { responseType: "stream" }
    );

    res.setHeader("Content-Type", "text/plain");

    let fullResponse = ""; 

    response.data.on("data", (chunk) => {
      try {
        const jsonChunk = JSON.parse(chunk.toString());
        if (jsonChunk.response) {
          fullResponse += jsonChunk.response;
        }
      } catch (error) {
        console.error("Error parsing JSON chunk:", error);
      }
    });

    response.data.on("end", () => {
      // Remove <think>...</think> tags and enclosed content
      const filteredText = fullResponse.replace(/<think>.*?<\/think>/gs, ""); 
      res.send(filteredText.trim());
    });

  } catch (error) {
    console.error("Error fetching or summarizing reviews:", error);
    res.status(500).send("Request failed");
  }
});
