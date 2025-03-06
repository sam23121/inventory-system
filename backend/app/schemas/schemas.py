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
    kristna_abat_id: Optional[int] = None
    profile_picture: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    user_type: Optional[UserType] = None
    kristna_abat: Optional['User'] = None
    kristna_children: List['User'] = []

    @property
    def roles(self) -> List[Role]:
        return self.user_type.roles if self.user_type else []

    class Config:
        from_attributes = True

# Item schemas
class ItemTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class ItemTypeCreate(ItemTypeBase):
    pass

class ItemType(ItemTypeBase):
    id: int
    
    class Config:
        from_attributes = True

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
    item_type: Optional['ItemType'] = None
    
    class Config:
        from_attributes = True

# Transaction schemas
class TransactionTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class TransactionTypeCreate(TransactionTypeBase):
    pass

class TransactionType(TransactionTypeBase):
    id: int
    
    class Config:
        from_attributes = True

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
    trans_type: Optional['TransactionType'] = None
    approved_by: Optional['User'] = None
    requested_by: Optional['User'] = None
    
    class Config:
        from_attributes = True

# Document schemas
class DocumentTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class DocumentTypeCreate(DocumentTypeBase):
    pass

class DocumentType(DocumentTypeBase):
    id: int
    
    class Config:
        from_attributes = True

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
    doc_type: Optional['DocumentType'] = None
    
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
    schedule_type: Optional['ScheduleType'] = None
    shift: Optional['Shift'] = None
    user: Optional['User'] = None
    assigned_by: Optional['User'] = None
    approved_by: Optional['User'] = None
    
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

# Base Religious Document Schema
class ReligiousDocumentBase(BaseModel):
    serial_number: Optional[str] = None
    english_name: Optional[str]
    english_father_name: Optional[str]
    english_mother_name: Optional[str]
    english_christian_name: Optional[str]
    amharic_name: str
    amharic_father_name: str
    amharic_mother_name: str
    amharic_christian_name: str
    date_of_birth: datetime
    place_of_birth: str
    address: Optional[str]
    phone_number: Optional[str]
    priest_name: Optional[str]
    priest_id: Optional[int]
    amharic_witness_name_1: str
    amharic_witness_name_2: str
    english_witness_name_1: Optional[str]
    english_witness_name_2: Optional[str]
    address_witness_1: str
    address_witness_2: str
    recorded_by_id: int
    approved_by_id: int


class ReligiousDocumentCreate(ReligiousDocumentBase):
    pass

class ReligiousDocument(ReligiousDocumentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    priest: Optional[User]
    recorded_by: Optional[User]
    approved_by: Optional[User]

    class Config:
        from_attributes = True

# Membership Document Schemas
class MembershipDocumentCreate(ReligiousDocumentCreate):
    pass

class MembershipDocument(ReligiousDocument):
    pass

# Baptism Document Schemas
class BaptismDocumentCreate(ReligiousDocumentCreate):
    baptism_date: datetime
    baptism_place: str
    amharic_god_parent_name: str
    english_god_parent_name: Optional[str]

class BaptismDocument(ReligiousDocument):
    baptism_date: datetime
    baptism_place: str
    amharic_god_parent_name: str
    english_god_parent_name: Optional[str]

# Burial Document Schemas
class BurialDocumentCreate(ReligiousDocumentCreate):
    date_of_death: datetime
    place_of_death: str
    cause_of_death: str
    burial_date: datetime

class BurialDocument(ReligiousDocument):
    date_of_death: datetime
    place_of_death: str
    cause_of_death: str
    burial_date: datetime

# Marriage Document Schemas
class MarriageDocumentCreate(ReligiousDocumentCreate):
    english_bride_name: Optional[str]
    english_bride_father_name: Optional[str]
    english_bride_mother_name: Optional[str]
    amharic_groom_name: str
    amharic_groom_father_name: str
    amharic_groom_mother_name: str
    amharic_bride_name: str
    amharic_bride_father_name: str
    amharic_bride_mother_name: str
    date_of_marriage: datetime
    place_of_marriage: str

class MarriageDocument(ReligiousDocument):
    english_groom_name: Optional[str]
    english_groom_father_name: Optional[str]
    english_groom_mother_name: Optional[str]
    english_bride_name: Optional[str]
    english_bride_father_name: Optional[str]
    english_bride_mother_name: Optional[str]
    amharic_groom_name: str
    amharic_groom_father_name: str
    amharic_groom_mother_name: str
    amharic_bride_name: str
    amharic_bride_father_name: str
    amharic_bride_mother_name: str
    date_of_marriage: datetime
    place_of_marriage: str

