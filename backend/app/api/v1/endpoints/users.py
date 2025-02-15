from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ....db.session import SessionLocal, engine
from .... import models, schemas
from ....core.security import get_password_hash, get_current_user
import pprint

# Create tables
models.Base.metadata.create_all(bind=engine)

router = APIRouter(dependencies=[Depends(get_current_user)])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.phone_number == user.phone_number).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    hashed_password = get_password_hash(user.password)
    
    db_user = models.User(
        phone_number=user.phone_number,
        name=user.name,
        hashed_password=hashed_password,
        type_id=user.type_id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for var, value in vars(user).items():
        if var != "password":
            setattr(db_user, var, value)
        else:
            db_user.hashed_password = get_password_hash(value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"} 

@router.get("/roles/", response_model=List[schemas.Role])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = db.query(models.Role).offset(skip).limit(limit).all()
    return roles

@router.get("/roles/{role_id}", response_model=schemas.Role)
def read_role(role_id: int, db: Session = Depends(get_db)):
    db_role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role


@router.put("/roles/{role_id}", response_model=schemas.Role)
def update_role(role_id: int, role: schemas.Role, db: Session = Depends(get_db)):
    db_role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    
    db_role.name = role.name
    db.commit()
    db.refresh(db_role)
    return db_role

@router.delete("/roles/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    db_role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    
    db.delete(db_role)
    db.commit()
    return {"message": "Role deleted successfully"}

@router.post("/roles", response_model=schemas.Role)
def create_role(role: schemas.RoleCreate, db: Session = Depends(get_db)):
    db_role = db.query(models.Role).filter(models.Role.name == role.name).first()
    if db_role:
        raise HTTPException(status_code=400, detail="Role already registered")
    
    db_role = models.Role(name=role.name)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.get("/types/", response_model=List[schemas.UserType])
def read_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    types = db.query(models.UserType).offset(skip).limit(limit).all()
    return types

@router.get("/types/{type_id}", response_model=schemas.UserType)
def read_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.UserType).filter(models.UserType.id == type_id).first()
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    return db_type

@router.get("/types/{type_id}/users", response_model=List[schemas.User])
def read_type_users(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.UserType).filter(models.UserType.id == type_id).first()
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    
    users = db.query(models.User).filter(models.User.type_id == type_id).all()
    return users

@router.put("/types/{type_id}", response_model=schemas.UserType)
def update_type(type_id: int, type: schemas.UserType, db: Session = Depends(get_db)):
    db_type = db.query(models.UserType).filter(models.UserType.id == type_id).first()
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    
    db_type.name = type.name
    db.commit()
    db.refresh(db_type)
    return db_type

@router.delete("/types/{type_id}")
def delete_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.UserType).filter(models.UserType.id == type_id).first()
    if db_type is None:
        raise HTTPException(status_code=404, detail="Type not found")
    
    db.delete(db_type)
    db.commit()
    return {"message": "Type deleted successfully"}

@router.post("/types", response_model=schemas.UserType)
def create_type(type: schemas.UserTypeCreate, db: Session = Depends(get_db)):
    db_type = db.query(models.UserType).filter(models.UserType.name == type.name).first()
    if db_type:
        raise HTTPException(status_code=400, detail="Type already registered")
    
    db_type = models.UserType(name=type.name)
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


