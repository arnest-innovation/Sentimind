import firebase_admin
from firebase_admin import credentials, firestore
import requests
import weaviate

# Connect to Weaviate
client = weaviate.Client("http://localhost:8080")

if client.is_ready():
    print("✅ Weaviate is running!")
else:
    print("❌ Weaviate is NOT running.")

# Initialize Firebase
cred = credentials.Certificate("/Users/thotavinay/Documents/Sentimind/firebase/sentimind1-df6c2-firebase-adminsdk-fbsvc-c6d16a58bb.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Ollama Local Embedding URL
DEEPSEEK_EMBEDDING_URL = "http://127.0.0.1:11434/api/embeddings"

# Function to get embeddings from DeepSeek (Ollama locally)
def get_embedding(text):
    data = {"model": "deepseek-r1", "prompt": text}
    response = requests.post(DEEPSEEK_EMBEDDING_URL, json=data)
    response_data = response.json()

    if "embedding" in response_data:
        return response_data["embedding"]
    else:
        raise ValueError(f"Error from Ollama (DeepSeek): {response_data}")

def store_embeddings(reviews):
    schema = {
        "classes": [
            {
                "class": "SentimentReview",
                "description": "Stores product review text with embeddings",
                "properties": [
                    {"name": "review_id", "dataType": ["string"]},
                    {"name": "text", "dataType": ["text"]}
                ],
                "vectorIndexType": "hnsw",
                "vectorizer": "none"
            }
        ]
    }

    client.schema.create(schema)

    for review_id, text in reviews.items():
        if text:
            embedding = get_embedding(text)
            client.data_object.create(
                class_name="SentimentReview",
                data={"review_id": review_id, "text": text},
                vector=embedding
            )

    print("✅ Embeddings stored in Weaviate!")

# Fetch reviews from Firebase Firestore
def fetch_reviews():
    parent_doc_ref = db.collection("products").document("B0009XLVG0")
    reviews_ref = parent_doc_ref.collection("reviews")
    docs = reviews_ref.stream()
    return {doc.id: doc.to_dict().get("reviewText", "") for doc in docs}

# Query Firestore for similar reviews (Manually Fetch and Compare)
def query_weaviate(query_text):
    query_embedding = get_embedding(query_text)
    response = client.query.get("SentimentReview", ["text", "date"]).with_near_vector(query_embedding).with_limit(5).do()
    return response["data"]["Get"]["SentimentReview"]

def get_all_weaviate_data():
    response = client.query.get("SentimentReview", ["text", "date"]).do()
    return response["data"]["Get"]["SentimentReview"]

# Execute the process
reviews = fetch_reviews()
print("📝 Fetched Reviews:", reviews)
store_embeddings(reviews)

# Example query
query_text = "This product is amazing!"
similar_reviews = query_weaviate(query_text)
print("🔍 Similar Reviews:", similar_reviews)