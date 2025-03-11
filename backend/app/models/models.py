from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text, Table, Time, JSON, Date
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from ..db.base import Base
from sqlalchemy.ext.declarative import declared_attr

usertype_roles = Table(
    "usertype_roles",
    Base.metadata,
    Column("user_type_id", Integer, ForeignKey("user_types.id")),
    Column("role_id", Integer, ForeignKey("roles.id")),
)

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    
    user_types = relationship("UserType", secondary=usertype_roles, back_populates="roles")

class UserType(Base):
    __tablename__ = "user_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    
    roles = relationship("Role", secondary=usertype_roles, back_populates="user_types")
    users = relationship("User", back_populates="user_type")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone_number = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    type_id = Column(Integer, ForeignKey("user_types.id"))
    kristna_abat_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    profile_picture = Column(String, nullable=True)  # Store base64 encoded image or URL
    
    user_type = relationship("UserType", back_populates="users")
    assigned_schedules = relationship("Schedule", foreign_keys="Schedule.assigned_by_id")
    approved_schedules = relationship("Schedule", foreign_keys="Schedule.approved_by_id")
    my_schedule = relationship("Schedule", foreign_keys="Schedule.user_id")
    kristna_abat = relationship("User", remote_side=[id], backref="kristna_children")

    # For Religious Documents
    membershipdocument = relationship("MembershipDocument",
                                        foreign_keys="MembershipDocument.priest_id",
                                        back_populates="priest")
    
    baptismdocument = relationship("BaptismDocument", 
                                   foreign_keys="BaptismDocument.priest_id",
                                   back_populates="priest")
    burialdocument = relationship("BurialDocument", 
                                  foreign_keys="BurialDocument.priest_id",
                                  back_populates="priest")
    marriagedocument = relationship("MarriageDocument", 
                                    foreign_keys="MarriageDocument.priest_id",
                                    back_populates="priest")

    # Religious Documents - recorded_by relationships
    recorded_membership_documents = relationship("MembershipDocument",
                                              foreign_keys="MembershipDocument.recorded_by_id",
                                              back_populates="recorded_by")
    recorded_baptism_documents = relationship("BaptismDocument",
                                           foreign_keys="BaptismDocument.recorded_by_id",
                                           back_populates="recorded_by")
    recorded_burial_documents = relationship("BurialDocument",
                                         foreign_keys="BurialDocument.recorded_by_id",
                                         back_populates="recorded_by")
    recorded_marriage_documents = relationship("MarriageDocument",
                                           foreign_keys="MarriageDocument.recorded_by_id",
                                           back_populates="recorded_by")

    # Religious Documents - approved_by relationships
    approved_membership_documents = relationship("MembershipDocument",
                                              foreign_keys="MembershipDocument.approved_by_id",
                                              back_populates="approved_by")
    approved_baptism_documents = relationship("BaptismDocument",
                                           foreign_keys="BaptismDocument.approved_by_id",
                                           back_populates="approved_by")
    approved_burial_documents = relationship("BurialDocument",
                                         foreign_keys="BurialDocument.approved_by_id",
                                         back_populates="approved_by")
    approved_marriage_documents = relationship("MarriageDocument",
                                           foreign_keys="MarriageDocument.approved_by_id",
                                           back_populates="approved_by")

class ScheduleType(Base):
    __tablename__ = "schedule_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)

    schedules = relationship("Schedule", back_populates="schedule_type")

class Shift(Base):
    __tablename__ = "shifts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    description = Column(Text)
    
    schedules = relationship("Schedule", back_populates="shift")

class Schedule(Base):
    __tablename__ = "schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    description = Column(Text)
    type_id = Column(Integer, ForeignKey("schedule_types.id"))
    shift_id = Column(Integer, ForeignKey("shifts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_by_id = Column(Integer, ForeignKey("users.id"))
    approved_by_id = Column(Integer, ForeignKey("users.id"))
    
    schedule_type = relationship("ScheduleType", back_populates="schedules")
    shift = relationship("Shift", back_populates="schedules")
    user = relationship("User", foreign_keys=[user_id], back_populates="my_schedule")
    assigned_by = relationship("User", foreign_keys=[assigned_by_id], back_populates="assigned_schedules")
    approved_by = relationship("User", foreign_keys=[approved_by_id], back_populates="approved_schedules")

class DocumentType(Base):
    __tablename__ = "document_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    
    documents = relationship("Document", back_populates="doc_type")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    serial_number = Column(String, unique=True, index=True)
    type_id = Column(Integer, ForeignKey("document_types.id"))
    description = Column(Text)
    quantity = Column(Integer)
    date_joined = Column(DateTime, server_default=func.now())
    date_updated = Column(DateTime, onupdate=func.now())
    
    doc_type = relationship("DocumentType", back_populates="documents")

class ItemType(Base):
    __tablename__ = "item_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    
    items = relationship("Item", back_populates="item_type")

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    serial_number = Column(String, unique=True, index=True)
    type_id = Column(Integer, ForeignKey("item_types.id"))
    description = Column(Text)
    quantity = Column(Integer)
    date_joined = Column(DateTime, server_default=func.now())
    date_updated = Column(DateTime, onupdate=func.now())
    
    item_type = relationship("ItemType", back_populates="items")

class TransactionType(Base):
    __tablename__ = "transaction_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    
    transactions = relationship("Transaction", back_populates="trans_type")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    type_id = Column(Integer, ForeignKey("transaction_types.id"))
    description = Column(Text)
    quantity = Column(Integer)
    date_taken = Column(DateTime)
    date_returned = Column(DateTime, nullable=True)
    status = Column(String)
    approved_by_id = Column(Integer, ForeignKey("users.id"))
    requested_by_id = Column(Integer, ForeignKey("users.id"))
    
    trans_type = relationship("TransactionType", back_populates="transactions")
    approved_by = relationship("User", foreign_keys=[approved_by_id])
    requested_by = relationship("User", foreign_keys=[requested_by_id])

class ReligiousDocumentBase(Base):
    __abstract__ = True
    id = Column(Integer, primary_key=True, index=True)

    serial_number = Column(String, unique=True, index=True, nullable=False)

    english_name = Column(String, index=True, nullable=True)
    english_christian_name = Column(String, index=True, nullable=True)
    english_father_name = Column(String, index=True, nullable=True)
    english_mother_name = Column(String, index=True, nullable=True)

    amharic_name = Column(String, index=True)
    amharic_christian_name = Column(String, index=True)
    amharic_father_name = Column(String, index=True)
    amharic_mother_name = Column(String, index=True)

    date_of_birth = Column(DateTime, nullable=False) #for future this should be date
    place_of_birth = Column(String, nullable=False)
    address = Column(String)
    phone_number = Column(String)

    priest_name = Column(String, nullable=True)
    priest_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    amharic_witness_name_1 = Column(String, nullable=True)
    amharic_witness_name_2 = Column(String, nullable=True)
    english_witness_name_1 = Column(String, nullable=True)
    english_witness_name_2 = Column(String, nullable=True)
    address_witness_1 = Column(String, nullable=True)
    address_witness_2 = Column(String, nullable=True)
    
    priest_id = Column(Integer, ForeignKey("users.id"))
    recorded_by_id = Column(Integer, ForeignKey("users.id"))
    approved_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


    @declared_attr
    def priest(cls):
        return relationship("User", 
                          foreign_keys=[cls.priest_id],
                          back_populates=f"{cls.__name__.lower()}")

    @declared_attr
    def recorded_by(cls):
        return relationship("User", 
                          foreign_keys=[cls.recorded_by_id],
                          primaryjoin=f"User.id == {cls.__name__}.recorded_by_id")

    @declared_attr
    def approved_by(cls):
        return relationship("User", 
                          foreign_keys=[cls.approved_by_id],
                          primaryjoin=f"User.id == {cls.__name__}.approved_by_id")

class MembershipDocument(ReligiousDocumentBase):
    __tablename__ = "membership_documents"

class BaptismDocument(ReligiousDocumentBase):
    __tablename__ = "baptism_documents"
    baptism_date = Column(DateTime)
    baptism_place = Column(String)
    amharic_god_parent_name = Column(String)
    english_god_parent_name = Column(String)

class BurialDocument(ReligiousDocumentBase):
    __tablename__ = "burial_documents"
    
    date_of_death = Column(DateTime)
    place_of_death = Column(String)
    cause_of_death = Column(String)
    burial_date = Column(DateTime)

class MarriageDocument(ReligiousDocumentBase):
    __tablename__ = "marriage_documents"
    
    english_bride_name = Column(String, index=True, nullable=True)
    english_bride_christian_name = Column(String, index=True, nullable=True)
    english_bride_father_name = Column(String, index=True, nullable=True)
    english_bride_mother_name = Column(String, index=True, nullable=True)
    
    amharic_bride_name = Column(String, index=True)
    amharic_bride_christian_name = Column(String, index=True)
    amharic_bride_father_name = Column(String, index=True)
    amharic_bride_mother_name = Column(String, index=True)
    
    date_of_marriage = Column(DateTime)
    place_of_marriage = Column(String)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    table_name = Column(String, index=True)
    record_id = Column(Integer)
    action = Column(String)  # CREATE, UPDATE, DELETE
    changes = Column(JSON)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, server_default=func.now())
    
    user = relationship("User", foreign_keys=[user_id])