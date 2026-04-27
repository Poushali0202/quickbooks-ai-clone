from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    description = Column(String, index=True)
    category = Column(String, index=True)  # e.g., Food, Rent, Salary
    amount = Column(Float)
    type = Column(String)  # "income" or "expense"
