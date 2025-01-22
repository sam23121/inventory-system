from pydantic import BaseModel, constr
from typing import Optional, List
from datetime import datetime

# Role schemas
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    name: str
    phone_number: constr(pattern=r'^\+?1?\d{9,15}$')  # Basic phone number validation
    type_id: int
    role_id: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# Item schemas
class ItemBase(BaseModel):
    name: str
    type_id: int
    description: Optional[str] = None
    quantity: int

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    date_joined: datetime
    date_updated: Optional[datetime]
    
    class Config:
        from_attributes = True

# Transaction schemas
class TransactionBase(BaseModel):
    type_id: int
    description: Optional[str] = None
    quantity: int
    date_taken: datetime
    date_returned: Optional[datetime] = None
    status: str
    approved_by_id: int
    requested_by_id: int

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    
    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    name: str
    type_id: int
    description: Optional[str] = None
    quantity: int

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    date_joined: datetime
    date_updated: Optional[datetime]
    
    class Config:
        from_attributes = True

# Document Type schemas
class DocumentTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class DocumentTypeCreate(DocumentTypeBase):
    pass

class DocumentType(DocumentTypeBase):
    id: int
    
    class Config:
        from_attributes = True 