from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Tuple
from ....api.deps import get_db_user
from ....db.session import SessionLocal
from .... import models, schemas
from ....core.security import get_current_user
from ....core.audit import audit_context

router = APIRouter(dependencies=[Depends(get_current_user)])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Transaction)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    with audit_context(db, "CREATE"):
        db_transaction = models.Transaction(**transaction.dict())
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction

@router.get("/", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

@router.get("/{transaction_id}", response_model=schemas.Transaction)
def read_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@router.put("/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(
    transaction_id: int,
    transaction: schemas.TransactionCreate,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    with audit_context(db, "UPDATE"):
        for var, value in vars(transaction).items():
            setattr(db_transaction, var, value)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    with audit_context(db, "DELETE"):
        db.delete(db_transaction)
        db.commit()
        return {"message": "Transaction deleted successfully"}

@router.get("/types/", response_model=List[schemas.TransactionType])
def read_transaction_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transaction_types = db.query(models.TransactionType).offset(skip).limit(limit).all()
    return transaction_types

@router.get("/types/{transaction_type_id}", response_model=schemas.TransactionType)
def read_transaction_type(transaction_type_id: int, db: Session = Depends(get_db)):
    db_transaction_type = db.query(models.TransactionType).filter(models.TransactionType.id == transaction_type_id).first()
    if db_transaction_type is None:
        raise HTTPException(status_code=404, detail="Transaction type not found")
    return db_transaction_type

@router.post("/types/", response_model=schemas.TransactionType)
def create_transaction_type(transaction_type: schemas.TransactionTypeCreate, db: Session = Depends(get_db)):
    db_transaction_type = models.TransactionType(**transaction_type.dict())
    db.add(db_transaction_type)
    db.commit()
    db.refresh(db_transaction_type)
    return db_transaction_type

@router.put("/types/{transaction_type_id}", response_model=schemas.TransactionType)
def update_transaction_type(transaction_type_id: int, transaction_type: schemas.TransactionTypeCreate, db: Session = Depends(get_db)):
    db_transaction_type = db.query(models.TransactionType).filter(models.TransactionType.id == transaction_type_id).first()
    if db_transaction_type is None:
        raise HTTPException(status_code=404, detail="Transaction type not found")
    
    for var, value in vars(transaction_type).items():
        setattr(db_transaction_type, var, value)
    
    db.commit()
    db.refresh(db_transaction_type)
    return db_transaction_type

@router.delete("/types/{transaction_type_id}")
def delete_transaction_type(transaction_type_id: int, db: Session = Depends(get_db)):
    db_transaction_type = db.query(models.TransactionType).filter(models.TransactionType.id == transaction_type_id).first()
    if db_transaction_type is None:
        raise HTTPException(status_code=404, detail="Transaction type not found")
    
    db.delete(db_transaction_type)
    db.commit()
    return {"message": "Transaction type deleted successfully"}

