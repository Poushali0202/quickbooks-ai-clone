from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import agent


import models
from database import engine, get_db

# This line ensures your database tables are created
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="QuickBooks AI Clone API")

# Allow our React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/transactions")
def get_transactions(db: Session = Depends(get_db)):
    # Fetch all transactions, ordered by newest first
    transactions = db.query(models.Transaction).order_by(models.Transaction.date.desc()).all()
    return transactions

@app.get("/api/summary")
def get_summary(db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).all()
    
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = total_income - total_expense
    
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance
    }

# Define what the incoming chat request looks like
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat_with_ai(request: ChatRequest):
    ai_response = agent.ask_financial_assistant(request.message)
    return {"response": ai_response}
