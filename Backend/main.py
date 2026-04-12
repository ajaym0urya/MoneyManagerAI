from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables early
load_dotenv()

from models import Expense, Income, ChatRequest
from services.db import save_financial_record, get_financial_records, save_chat_message
from services.ai import generate_budget_advice, process_chat

app = FastAPI(title="AI Budget Coach API")

# Configure CORS for Frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to Firebase Hosting URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Budget Coach API is running."}

@app.post("/api/expenses/{user_id}")
def add_expense(user_id: str, expense: Expense):
    saved = save_financial_record(user_id, "expense", expense.model_dump())
    return {"status": "success", "data": saved}

@app.post("/api/incomes/{user_id}")
def add_income(user_id: str, income: Income):
    saved = save_financial_record(user_id, "income", income.model_dump())
    return {"status": "success", "data": saved}

@app.get("/api/financials/{user_id}")
def get_financials(user_id: str):
    records = get_financial_records(user_id)
    return {"status": "success", "data": records}

@app.get("/api/budget/advice/{user_id}")
def get_budget_advice(user_id: str):
    records = get_financial_records(user_id)
    advice = generate_budget_advice(records)
    return {"status": "success", "data": advice}

@app.post("/api/chat")
def chat_with_ai(request: ChatRequest):
    records = get_financial_records(request.user_id)
    financial_context = request.financial_context or records
    
    response_text = process_chat(request.message, [], financial_context)
    
    save_chat_message(request.user_id, {"role": "user", "content": request.message})
    save_chat_message(request.user_id, {"role": "assistant", "content": response_text})
    
    return {"status": "success", "message": response_text}
