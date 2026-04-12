import os
import firebase_admin
from firebase_admin import credentials, firestore
import json

# Initialize Firestore DB
def get_db():
    if not firebase_admin._apps:
        try:
            # Try initializing with standard environment credentials
            app = firebase_admin.initialize_app()
        except ValueError:
            # Fallback to local service account key if provided in env
            cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                app = firebase_admin.initialize_app(cred)
            else:
                print("WARNING: Firestore not initialized. No credentials found. Using mock DB operations.")
                return None
    try:
        return firestore.client()
    except Exception as e:
        print(f"Error getting firestore client: {e}")
        return None

db = get_db()

# DB Helper functions
def save_financial_record(user_id: str, record_type: str, data: dict):
    if not db: return data # Mock return
    
    collection_name = "expenses" if record_type == "expense" else "incomes"
    doc_ref = db.collection("users").document(user_id).collection(collection_name).document()
    data['id'] = doc_ref.id
    doc_ref.set(data)
    return data

def get_financial_records(user_id: str):
    if not db: return {"expenses": [], "incomes": []}
    
    expenses = []
    incomes = []
    
    try:
        exp_docs = db.collection("users").document(user_id).collection("expenses").stream()
        for doc in exp_docs:
            expenses.append(doc.to_dict())
            
        inc_docs = db.collection("users").document(user_id).collection("incomes").stream()
        for doc in inc_docs:
            incomes.append(doc.to_dict())
    except Exception as e:
        print(f"Error fetching from firestore: {e}")
        
    return {"expenses": expenses, "incomes": incomes}

def save_chat_message(user_id: str, message: dict):
    if not db: return
    try:
        db.collection("users").document(user_id).collection("chats").add(message)
    except Exception as e:
        print(f"Error saving chat: {e}")
