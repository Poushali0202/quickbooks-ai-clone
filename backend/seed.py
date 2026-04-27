import random
from datetime import date, timedelta
from database import SessionLocal, engine
import models

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    # Check if we already seeded it
    if db.query(models.Transaction).first():
        print("Database already contains data. Skipping seed.")
        return

    print("Seeding database with mock transactions...")

    categories = ["Groceries", "Dining", "Utilities", "Entertainment", "Transport"]
    
    # Add a salary income for the last 3 months
    for i in range(3):
        salary_date = date.today() - timedelta(days=i*30)
        salary = models.Transaction(
            date=salary_date,
            description="Tech Corp Salary",
            category="Salary",
            amount=5000.00,
            type="income"
        )
        db.add(salary)

    # Add 50 random expenses over the last 90 days
    for _ in range(50):
        days_ago = random.randint(0, 90)
        txn_date = date.today() - timedelta(days=days_ago)
        cat = random.choice(categories)
        amount = round(random.uniform(10.0, 150.0), 2)
        
        expense = models.Transaction(
            date=txn_date,
            description=f"Quick {cat} payment",
            category=cat,
            amount=amount,
            type="expense"
        )
        db.add(expense)

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
