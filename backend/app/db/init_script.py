from sqlalchemy.orm import Session
from sqlalchemy import text
import sys
sys.path = ['', '..'] + sys.path[1:]
from app.db.session import SessionLocal, engine
from app.models.base import Base
from app.db.init_db import init_db

def init():
    db = SessionLocal()
    # create tables
    Base.metadata.create_all(bind=engine)
    try:
        init_db(db)
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing data...")
    init()
    print("Database reset complete!")