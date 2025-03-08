from typing import Generator, Tuple
from fastapi import Depends
from sqlalchemy.orm import Session
from ..db.session import SessionLocal
from ..core.security import get_current_user
from .. import models

def get_db_user() -> Generator[Tuple[Session, models.User], None, None]:
    """
    Get both database session and current user
    """
    db = SessionLocal()
    try:
        user = get_current_user(db=db)
        yield db, user
    finally:
        db.close()
