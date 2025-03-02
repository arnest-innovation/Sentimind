# Sentimind: AI-Powered Sentiment Analysis

Sentimind is an **AI-driven sentiment analysis tool** that processes customer feedback to provide structured insights. It helps businesses understand user sentiment by summarizing reviews and extracting key themes using hashtags.

---

## 🚀 Features

✅ **Automated Sentiment Analysis** – Generates concise sentiment summaries.  
✅ **Keyword Extraction** – Extracts relevant hashtags from customer feedback.  
✅ **Review Filtering** – Retrieves reviews by product and date range.  
✅ **AI-Powered Insights** – Uses **DeepSeek-R1** for intelligent summarization.  

---

sentimind/
│-- functions/assets/
│   ├── sentimind-diagram.webp
│-- README.md

![Sentimind Architecture](/functions/assets/sentimind-diagram.webp)

---

## 📦 Installation & Setup

### **1️⃣ Clone the Repository**
```sh
# Clone the project
git clone git@github.com:arnest-innovation/Sentimind.git

# Navigate into the directory
cd sentimind
```

### **2️⃣ Install Dependencies**
```sh
# Install required dependencies
npm install
```

### **3️⃣ Set Up Firebase**
1. Create a **Firebase** project in the Firebase Console.
2. Download the service account JSON file.
3. Place it in the `firebase/` folder inside the project directory.

### **4️⃣ Import Reviews from Excel**
```sh
# Run the import script to upload reviews to Firestore
node importReviews.js
```

---

## 🚀 Using the API (Test with Postman)

### **5️⃣ Summarization Endpoint**

#### **Endpoint:**
```http
POST /summarization
```
#### **Request Body:**
```json
{
  "product_id": "12345",
  "timeRange": "one_year"
}
```
#### **Response Example:**
```json
{
  "summary": "Customers love the product's durability and design but want better battery life.",
  "hashtags": ["#Durable", "#Stylish", "#BatteryLife"]
}
```

---

## 📂 Project Structure
```
sentimind/
│-- firebase/                     # Firebase service credentials
│-- importReviews.js               # Imports Excel reviews into Firestore
│-- functions/                     # Firebase Cloud Functions
│   ├── index.js                   # API endpoint for sentiment summarization
│-- sentimind1.xlsx                # Sample review dataset
│-- README.md                      # Documentation
│-- package.json                   # Dependencies
```

---

## 🎯 Why Sentimind?
✅ **Saves Time** – Automates review analysis.  
✅ **Enhances Decision-Making** – Provides structured insights.  
✅ **Seamless Integration** – Works via API calls.  

---

## 🤝 Contributing
We welcome contributions! Feel free to improve the summarization model, enhance filtering, or add new features.  

### **Steps to Contribute:**
```sh

# Create a new branch
git checkout -b feature-new-update

# Commit changes
git commit -m "Added new feature"

# Push to your fork
git push origin feature-new-update


