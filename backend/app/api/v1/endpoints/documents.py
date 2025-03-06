from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Tuple
from ....db.session import SessionLocal
from .... import models, schemas
from datetime import datetime
from ....core.security import get_current_user
from ....api.deps import get_db_user
from ....core.audit import audit_context

router = APIRouter(dependencies=[Depends(get_current_user)])

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
    # add the joindate and updatedate as today
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

def generate_document_serial(db: Session, type_id: int, prefix: str="Doc") -> str:
    """Generate a unique serial number for documents"""
    # Get the document type prefix
    # doc_type = db.query(models.DocumentType).filter(models.DocumentType.id == type_id).first()
    # prefix = doc_type.name[:3].upper()
    
    # Get the current year
    year = datetime.now().strftime("%Y")
    
    # Count existing documents of this type for this year
    count = db.query(models.Document).filter(
        models.Document.date_joined >= f"{year}-01-01"
    ).count()
    
    # Generate serial number: PREFIX-YEAR-SEQUENCE
    serial = f"{prefix}-{year}-{(count + 1):04d}"
    return serial

@router.post("/", response_model=schemas.Document)
def create_document(
    document: schemas.DocumentCreate,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    with audit_context(db, "CREATE"):
        db_document = models.Document(**document.dict())
        db_document.date_joined = datetime.now()
        db_document.date_updated = datetime.now()
        db_document.serial_number = generate_document_serial(db, document.type_id)
        
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
def update_document(
    document_id: int,
    document: schemas.DocumentCreate,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    with audit_context(db, "UPDATE"):
        for var, value in vars(document).items():
            setattr(db_document, var, value)
        db.commit()
        db.refresh(db_document)
        return db_document

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    db_document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    with audit_context(db, "DELETE"):
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


@router.get("/membership/", response_model=List[schemas.MembershipDocument])
def read_membership_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    documents = db.query(models.MembershipDocument).offset(skip).limit(limit).all()
    return documents

@router.put("/membership/{document_id}", response_model=schemas.MembershipDocument)
def update_membership_document(document_id: int, document: schemas.MembershipDocumentUpdate, db: Session = Depends(get_db)):
    db_document = db.query(models.MembershipDocument).filter(models.MembershipDocument.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Membership document not found")
    
    for var, value in vars(document).items():
        setattr(db_document, var, value)
    
    db.commit()
    db.refresh(db_document)
    return db_document

@router.post("/membership/", response_model=schemas.MembershipDocument)
def create_membership_document(document: schemas.MembershipDocumentCreate, db: Session = Depends(get_db)):
    db_document = models.MembershipDocument(**document.dict())
    # generate serial number
    if not db_document.serial_number:
        db_document.serial_number = generate_document_serial(db, prefix="አባ")
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.delete("/membership/{document_id}")
def delete_membership_document(document_id: int, db: Session = Depends(get_db)):
    db_document = db.query(models.MembershipDocument).filter(models.MembershipDocument.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Membership document not found")
    
    db.delete(db_document)
    db.commit()
    return {"message": "Membership document deleted successfully"}


@router.get("/baptism/", response_model=List[schemas.BaptismDocument])
def read_baptism_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    documents = db.query(models.BaptismDocument).offset(skip).limit(limit).all()
    return documents

@router.put("/baptism/{document_id}", response_model=schemas.BaptismDocument)
def update_baptism_document(document_id: int, document: schemas.BaptismDocumentUpdate, db: Session = Depends(get_db)):
    db_document = db.query(models.BaptismDocument).filter(models.BaptismDocument.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Baptism document not found")
    
    for var, value in vars(document).items():
        setattr(db_document, var, value)
    
    db.commit()
    db.refresh(db_document)
    return db_document

@router.post("/baptism/", response_model=schemas.BaptismDocument)
def create_baptism_document(document: schemas.BaptismDocumentCreate, db: Session = Depends(get_db)):
    db_document = models.BaptismDocument(**document.dict())
    # generate serial number
    if not db_document.serial_number:
        db_document.serial_number = generate_document_serial(db, prefix="ክር")
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.delete("/baptism/{document_id}")
def delete_baptism_document(document_id: int, db: Session = Depends(get_db)):
    db_document = db.query(models.BaptismDocument).filter(models.BaptismDocument.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Baptism document not found")
    
    db.delete(db_document)
    db.commit()
    return {"message": "Baptism document deleted successfully"}

@router.get("/burial/", response_model=List[schemas.BurialDocument])
def read_burial_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    documents = db.query(models.BurialDocument).offset(skip).limit(limit).all()
    return documents

@router.put("/burial/{document_id}", response_model=schemas.BurialDocument)
def update_burial_document(document_id: int, document: schemas.BurialDocumentUpdate, db: Session = Depends(get_db)):
    db_document = db.query(models.BurialDocument).filter(models.BurialDocument.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Burial document not found")
    
    for var, value in vars(document).items():
        setattr(db_document, var, value)
    
    db.commit()
    db.refresh(db_document)
    return db_document

@router.post("/burial/", response_model=schemas.BurialDocument)
def create_burial_document(document: schemas.BurialDocumentCreate, db: Session = Depends(get_db)):
    db_document = models.BurialDocument(**document.dict())
    # generate serial number
    if not db_document.serial_number:
        db_document.serial_number = generate_document_serial(db, prefix="ቀብ")
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.delete("/burial/{document_id}")
def delete_burial_document(document_id: int, db: Session = Depends(get_db)):
    db_document = db.query(models.BurialDocument).filter(models.BurialDocument.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Burial document not found")
    
    db.delete(db_document)
    db.commit()
    return {"message": "Burial document deleted successfully"}

@router.get("/marriage/", response_model=List[schemas.MarriageDocument])
def read_marriage_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    documents = db.query(models.MarriageDocument).offset(skip).limit(limit).all()
    return documents

@router.put("/marriage/{document_id}", response_model=schemas.MarriageDocument)
def update_marriage_document(document_id: int, document: schemas.MarriageDocumentUpdate, db: Session = Depends(get_db)):
    db_document = db.query(models.MarriageDocument).filter(models.MarriageDocument.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Marriage document not found")
    
    for var, value in vars(document).items():
        setattr(db_document, var, value)
    
    db.commit()
    db.refresh(db_document)
    return db_document

@router.post("/marriage/", response_model=schemas.MarriageDocument)
def create_marriage_document(document: schemas.MarriageDocumentCreate, db: Session = Depends(get_db)):
    db_document = models.MarriageDocument(**document.dict())
    # generate serial number
    if not db_document.serial_number:
        db_document.serial_number = generate_document_serial(db, prefix="ልዩ")
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@router.delete("/marriage/{document_id}")
def delete_marriage_document(document_id: int, db: Session = Depends(get_db)):
    db_document = db.query(models.MarriageDocument).filter(models.MarriageDocument.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Marriage document not found")
    
    db.delete(db_document)
    db.commit()
    return {"message": "Marriage document deleted successfully"}


