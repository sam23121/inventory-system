from pydantic import BaseModel, constr
from typing import Optional, List
from datetime import datetime, time
from sqlalchemy import Time

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
    serial_number: Optional[str] = None

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
    serial_number: Optional[str] = None

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
class ShiftBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_time: time
    end_time: time

class ShiftCreate(ShiftBase):
    pass

class Shift(ShiftBase):
    id: int
    
    class Config:
        from_attributes = True

class ScheduleTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class ScheduleTypeCreate(ScheduleTypeBase):
    pass

class ScheduleType(ScheduleTypeBase):
    id: int
    
    class Config:
        from_attributes = True

class ScheduleBase(BaseModel):
    date: datetime
    description: Optional[str] = None
    type_id: int
    shift_id: int
    user_id: int
    assigned_by_id: Optional[int]
    approved_by_id: Optional[int]

class ScheduleCreate(ScheduleBase):
    pass

class Schedule(ScheduleBase):
    id: int
    
    class Config:
        from_attributes = True

# AuditLog schemas
class AuditLogBase(BaseModel):
    table_name: str
    record_id: int
    action: str
    old_values: Optional[dict] = None
    new_values: Optional[dict] = None
    user_id: int
    timestamp: datetime

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: int
    
    class Config:
        from_attributes = True

