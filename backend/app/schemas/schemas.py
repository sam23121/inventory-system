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

# UserType schemas with roles relationship
class UserTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class UserTypeCreate(UserTypeBase):
    pass

class UserType(UserTypeBase):
    id: int
    roles: List[Role] = []
    
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    name: str
    phone_number: constr(pattern=r'^\+?1?\d{9,15}$')  # Basic phone number validation
    type_id: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    user_type: Optional[UserType] = None

    @property
    def roles(self) -> List[Role]:
        return self.user_type.roles if self.user_type else []

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

class ItemTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class ItemTypeCreate(ItemTypeBase):
    pass

class ItemType(ItemTypeBase):
    id: int
    
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

class TransactionTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class TransactionTypeCreate(TransactionTypeBase):
    pass

class TransactionType(TransactionTypeBase):
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

# Schedule schemas
class ScheduleBase(BaseModel):
    description: Optional[str] = None
    type: str
    user_id: int
    date: datetime

class ScheduleCreate(ScheduleBase):
    pass

class Schedule(ScheduleBase):
    id: int
    date: datetime
    
    class Config:
        from_attributes = True

        