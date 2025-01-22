from sqlalchemy.orm import Session
from app import models, schemas
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import random

def init_db(db: Session) -> None:
    # Create roles
    roles = [
        {"name": "Admin", "description": "System administrator"},
        {"name": "Manager", "description": "Department manager"},
        {"name": "User", "description": "Regular user"}
    ]
    
    for role_data in roles:
        role = models.Role(**role_data)
        db.add(role)
    db.commit()

    # Create users
    users = [
        {
            "name": "Admin User",
            "phone_number": "+251911111111",
            "hashed_password": get_password_hash("admin123"),
            "type_id": 1,
            "role_id": 1
        },
        {
            "name": "Manager User",
            "phone_number": "+251922222222",
            "hashed_password": get_password_hash("manager123"),
            "type_id": 2,
            "role_id": 2
        },
        {
            "name": "Regular User",
            "phone_number": "+251933333333",
            "hashed_password": get_password_hash("user123"),
            "type_id": 3,
            "role_id": 3
        }
    ]

    for user_data in users:
        user = models.User(**user_data)
        db.add(user)
    db.commit()

    # Create document types
    doc_types = [
        {"name": "Report", "description": "Official reports"},
        {"name": "Contract", "description": "Legal contracts"},
        {"name": "Form", "description": "Standard forms"}
    ]

    for doc_type_data in doc_types:
        doc_type = models.DocumentType(**doc_type_data)
        db.add(doc_type)
    db.commit()

    # Create documents
    documents = [
        {
            "name": "Annual Report 2023",
            "type_id": 1,
            "description": "Year-end report",
            "quantity": 5,
            "date_joined": datetime.now(),
            "date_updated": datetime.now()
        },
        {
            "name": "Employee Contract",
            "type_id": 2,
            "description": "Standard employment contract",
            "quantity": 10,
            "date_joined": datetime.now(),
            "date_updated": datetime.now()
        }
    ]

    for doc_data in documents:
        document = models.Document(**doc_data)
        db.add(document)
    db.commit()

    # Create items
    items = [
        {
            "name": "Laptop",
            "type_id": 1,
            "description": "Dell XPS 13",
            "quantity": 5,
            "date_joined": datetime.now(),
            "date_updated": datetime.now()
        },
        {
            "name": "Printer",
            "type_id": 2,
            "description": "HP LaserJet",
            "quantity": 3,
            "date_joined": datetime.now(),
            "date_updated": datetime.now()
        }
    ]

    for item_data in items:
        item = models.Item(**item_data)
        db.add(item)
    db.commit()

    # Create transactions
    transactions = [
        {
            "type_id": 1,
            "description": "Laptop borrowing",
            "quantity": 1,
            "date_taken": datetime.now() - timedelta(days=5),
            "date_returned": datetime.now(),
            "status": "returned",
            "approved_by_id": 1,
            "requested_by_id": 3
        },
        {
            "type_id": 2,
            "description": "Printer usage",
            "quantity": 1,
            "date_taken": datetime.now(),
            "status": "pending",
            "approved_by_id": 2,
            "requested_by_id": 3
        }
    ]

    for transaction_data in transactions:
        transaction = models.Transaction(**transaction_data)
        db.add(transaction)
    db.commit() 