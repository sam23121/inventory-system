from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models.base import Base
from app.db.init_db import init_db

def init():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating initial data")
    init()
    print("Initial data created") 