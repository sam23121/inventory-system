from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ....db.session import SessionLocal
from .... import models, schemas

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Document Type CRUD operations
@router.post("/types/", response_model=schemas.DocumentType)
def create_document_type(doc_type: schemas.DocumentTypeCreate, db: Session = Depends(get_db)):
    db_doc_type = models.DocumentType(**doc_type.dict())
    db.add(db_doc_type)
    db.commit()
    db.refresh(db_doc_type)
    return db_doc_type

@router.get("/types/", response_model=List[schemas.DocumentType])
def read_document_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    doc_types = db.query(models.DocumentType).offset(skip).limit(limit).all()
    return doc_types

@router.get("/types/{type_id}", response_model=schemas.DocumentType)
def read_document_type(type_id: int, db: Session = Depends(get_db)):
    db_doc_type = db.query(models.DocumentType).filter(models.DocumentType.id == type_id).first()
    if db_doc_type is None:
        raise HTTPException(status_code=404, detail="Document type not found")
    return db_doc_type

@router.put("/types/{type_id}", response_model=schemas.DocumentType)
def update_document_type(type_id: int, doc_type: schemas.DocumentTypeCreate, db: Session = Depends(get_db)):
    db_doc_type = db.query(models.DocumentType).filter(models.DocumentType.id == type_id).first()
    if db_doc_type is None:
        raise HTTPException(status_code=404, detail="Document type not found")
    
    for var, value in vars(doc_type).items():
        setattr(db_doc_type, var, value)
    
    db.commit()
    db.refresh(db_doc_type)
    return db_doc_type

@router.delete("/types/{type_id}")
def delete_document_type(type_id: int, db: Session = Depends(get_db)):
    db_doc_type = db.query(models.DocumentType).filter(models.DocumentType.id == type_id).first()
    if db_doc_type is None:
        raise HTTPException(status_code=404, detail="Document type not found")
    
    db.delete(db_doc_type)
    db.commit()
    return {"message": "Document type deleted successfully"}

# Document CRUD operations
@router.post("/", response_model=schemas.Document)
def create_document(document: schemas.DocumentCreate, db: Session = Depends(get_db)):
    # Verify if document type exists
    doc_type = db.query(models.DocumentType).filter(models.DocumentType.id == document.type_id).first()
    if not doc_type:
        raise HTTPException(status_code=404, detail="Document type not found")
    
    db_document = models.Document(**document.dict())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.get("/", response_model=List[schemas.Document])
def read_documents(
    skip: int = 0, 
    limit: int = 100, 
    type_id: int = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Document)
    if type_id:
        query = query.filter(models.Document.type_id == type_id)
    documents = query.offset(skip).limit(limit).all()
    return documents

@router.get("/{document_id}", response_model=schemas.Document)
def read_document(document_id: int, db: Session = Depends(get_db)):
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return db_document

@router.put("/{document_id}", response_model=schemas.Document)
def update_document(document_id: int, document: schemas.DocumentCreate, db: Session = Depends(get_db)):
    # Verify if document type exists
    doc_type = db.query(models.DocumentType).filter(models.DocumentType.id == document.type_id).first()
    if not doc_type:
        raise HTTPException(status_code=404, detail="Document type not found")
    
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    for var, value in vars(document).items():
        setattr(db_document, var, value)
    
    db.commit()
    db.refresh(db_document)
    return db_document

@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(db_document)
    db.commit()
    return {"message": "Document deleted successfully"}

# Additional utility endpoints
@router.get("/search/", response_model=List[schemas.Document])
def search_documents(
    query: str,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    documents = db.query(models.Document).filter(
        models.Document.name.ilike(f"%{query}%")
    ).offset(skip).limit(limit).all()
    return documents

@router.put("/{document_id}/quantity", response_model=schemas.Document)
def update_document_quantity(
    document_id: int,
    quantity: int,
    db: Session = Depends(get_db)
):
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")
    
    db_document.quantity = quantity
    db.commit()
    db.refresh(db_document)
    return db_document 