from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....db.session import SessionLocal
from .... import models, schemas
from ....core.security import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.Item).offset(skip).limit(limit).all()
    return items

@router.get("/{item_id}", response_model=schemas.Item)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.put("/{item_id}", response_model=schemas.Item)
def update_item(item_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    for var, value in vars(item).items():
        setattr(db_item, var, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted successfully"} 

@router.get("/types/", response_model=List[schemas.ItemType])
def read_item_types(db: Session = Depends(get_db)):
    item_types = db.query(models.ItemType).all()
    return item_types

@router.get("/types/{item_type_id}", response_model=schemas.ItemType)
def read_item_type(item_type_id: int, db: Session = Depends(get_db)):
    item_type = db.query(models.ItemType).filter(models.ItemType.id == item_type_id).first()
    if item_type is None:
        raise HTTPException(status_code=404, detail="Item type not found")
    return item_type

@router.post("/types/", response_model=schemas.ItemType)
def create_item_type(item_type: schemas.ItemTypeCreate, db: Session = Depends(get_db)):
    db_item_type = models.ItemType(**item_type.dict())
    db.add(db_item_type)
    db.commit()
    db.refresh(db_item_type)
    return db_item_type

@router.put("/types/{item_type_id}", response_model=schemas.ItemType)
def update_item_type(item_type_id: int, item_type: schemas.ItemTypeCreate, db: Session = Depends(get_db)):
    db_item_type = db.query(models.ItemType).filter(models.ItemType.id == item_type_id).first()
    if db_item_type is None:
        raise HTTPException(status_code=404, detail="Item type not found")
    
    for var, value in vars(item_type).items():
        setattr(db_item_type, var, value)
    
    db.commit()
    db.refresh(db_item_type)
    return db_item_type

@router.delete("/types/{item_type_id}")
def delete_item_type(item_type_id: int, db: Session = Depends(get_db)):
    db_item_type = db.query(models.ItemType).filter(models.ItemType.id == item_type_id).first()
    if db_item_type is None:
        raise HTTPException(status_code=404, detail="Item type not found")
    
    db.delete(db_item_type)
    db.commit()
    return {"message": "Item type deleted successfully"}

