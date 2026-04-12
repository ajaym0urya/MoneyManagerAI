from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Expense(BaseModel):
    id: Optional[str] = None
    category: str
    amount: float
    date: str
    description: Optional[str] = None

class Income(BaseModel):
    id: Optional[str] = None
    source: str
    amount: float
    date: str

class UserFinancials(BaseModel):
    user_id: str
    expenses: List[Expense] = []
    incomes: List[Income] = []

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    user_id: str
    message: str
    financial_context: Optional[dict] = None

class BudgetPlanResponse(BaseModel):
    recommended_budget: dict
    insights: List[str]
    savings_tips: List[str]
