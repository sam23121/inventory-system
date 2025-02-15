from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.base import Base

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
    
    user_type = relationship("UserType", back_populates="users")
    assigned_schedules = relationship("Schedule", foreign_keys="Schedule.assigned_by_id")
    approved_schedules = relationship("Schedule", foreign_keys="Schedule.approved_by_id")
    my_schedule = relationship("Schedule", foreign_keys="Schedule.user_id")

class Schedule(Base):
    __tablename__ = "schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    description = Column(Text)
    type = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_by_id = Column(Integer, ForeignKey("users.id"))
    approved_by_id = Column(Integer, ForeignKey("users.id"))

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