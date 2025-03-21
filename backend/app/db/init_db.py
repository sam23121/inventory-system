from sqlalchemy.orm import Session
from app import models, schemas
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import random

def init_db(db: Session) -> None:

    # Create roles
    roles = [
        {"name": "admin", "description": "Access for everything"},
        {"name": "add-user", "description": "Add new user"},
        {"name": "delete-user", "description": "Delete user"},
        {"name": "update-user", "description": "Update user"},
        {"name": "read-user", "description": "Read user"},
        {"name": "add-role", "description": "Add new role"},
        {"name": "delete-role", "description": "Delete role"},
        {"name": "update-role", "description": "Update role"},
        {"name": "read-role", "description": "Read role"},
        {"name": "add-user-type", "description": "Add new user type"},
        {"name": "delete-user-type", "description": "Delete user type"},
        {"name": "update-user-type", "description": "Update user type"},
        {"name": "read-user-type", "description": "Read user type"},
        {"name": "add-item", "description": "Add new item"},
        {"name": "delete-item", "description": "Delete item"},
        {"name": "update-item", "description": "Update item"},
        {"name": "read-item", "description": "Read item"},
        {"name": "add-transaction", "description": "Add new transaction"},
        {"name": "delete-transaction", "description": "Delete transaction"},
        {"name": "update-transaction", "description": "Update transaction"},
        {"name": "read-transaction", "description": "Read transaction"},
        {"name": "add-document", "description": "Add new document"},
        {"name": "delete-document", "description": "Delete document"},
        {"name": "update-document", "description": "Update document"},
        {"name": "read-document", "description": "Read document"},
        {"name": "add-document-type", "description": "Add new document type"},
        {"name": "delete-document-type", "description": "Delete document type"},
        {"name": "update-document-type", "description": "Update document type"},
        {"name": "read-document-type", "description": "Read document type"}
    ]

    try:
        for role_data in roles:
            role = models.Role(**role_data)
            db.add(role)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()
    
    
    # Create user types
    user_types = [
        {"name": "Admin", "description": "System administrator"},
        {"name": "Head", "description": "Department manager", },
        {"name": "Deacon", "description": "Deacons"},
        {"name": "Priest", "description": "Priests"},
        {"name": "Member", "description": "Regular member"},
    ]
    try:
        for user_type_data in user_types:
            user_type = models.UserType(**user_type_data)
            db.add(user_type)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()

    # create usertype_role
    usertype_roles = [
        {"user_type_id": 1, "role_id": 1},
        {"user_type_id": 2, "role_id": 1},
        {"user_type_id": 2, "role_id": 2},
    ]
    try:
        for usertype_role_data in usertype_roles:
            stmt = models.usertype_roles.insert().values(usertype_role_data)
            db.execute(stmt)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()


    # Create users
    users = [
        {
            "name": "Admin",
            "phone_number": "0911111111",
            "hashed_password": get_password_hash("admin123"),
            "type_id": 1,
            "kristna_abat_id": None
        },
        {
            "name": "Manager",
            "phone_number": "0922222222",
            "hashed_password": get_password_hash("manager123"),
            "type_id": 2,
            "kristna_abat_id": None
        },
        {
            "name": "Deacon",
            "phone_number": "0933333333",
            "hashed_password": get_password_hash("user123"),
            "type_id": 3,
            "kristna_abat_id": None
        },
        {
            "name": "Priest",
            "phone_number": "0944444444",
            "hashed_password": get_password_hash("user123"),
            "type_id": 4,
            "kristna_abat_id": None
        },
        {
            "name": "Member",
            "phone_number": "0955555555",
            "hashed_password": get_password_hash("user123"),
            "type_id": 5,
            "kristna_abat_id": None
        }
    ]
    try:
        for user_data in users:
            user = models.User(**user_data)
            db.add(user)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()

    # Create document types
    doc_types = [
        {"name": "Report", "description": "Official reports"},
        {"name": "Contract", "description": "Legal contracts"},
        {"name": "Form", "description": "Standard forms"}
    ]

    try:
        for doc_type_data in doc_types:
            doc_type = models.DocumentType(**doc_type_data)
            db.add(doc_type)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()

    # Create documents
    documents = [
        {
            "name": "Annual Report 2023",
            "serial_number": "AR2023",
            "type_id": 1,
            "description": "Year-end report",
            "quantity": 5,
            "date_joined": datetime.now(),
            "date_updated": datetime.now()
        },
        {
            "name": "Employee Contract",
            "serial_number": "EC2023",
            "type_id": 2,
            "description": "Standard employment contract",
            "quantity": 10,
            "date_joined": datetime.now(),
            "date_updated": datetime.now()
        }
    ]

    try:
        for doc_data in documents:
            document = models.Document(**doc_data)
            db.add(document)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback

    # Create item types
    item_types = [
        {"name": "Electronics", "description": "Electronic devices"},
        {"name": "Furniture", "description": "Office furniture"}
    ]

    try:
        for item_type_data in item_types:
            item_type = models.ItemType(**item_type_data)
            db.add(item_type)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()

    # Create items
    items = [
        {
            "name": "Laptop",
            "serial_number": "LT2023",
            "type_id": 1,
            "description": "Dell XPS 13",
            "quantity": 5,
            "date_joined": datetime.now(),
            "date_updated": datetime.now()
        },
        {
            "name": "Printer",
            "serial_number": "PR2023",
            "type_id": 1,
            "description": "HP LaserJet",
            "quantity": 3,
            "date_joined": datetime.now(),
            "date_updated": datetime.now()
        }
    ]

    try:
        for item_data in items:
            item = models.Item(**item_data)
            db.add(item)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()

    # create transaction types
    transaction_types = [
        {"name": "Borrowing", "description": "Item borrowing"},
        {"name": "Usage", "description": "Item usage"}
    ]

    try:
        for transaction_type_data in transaction_types:
            transaction_type = models.TransactionType(**transaction_type_data)
            db.add(transaction_type)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()

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
    try:
        for transaction_data in transactions:
            transaction = models.Transaction(**transaction_data)
            db.add(transaction)
        db.commit() 
    except Exception as e:
        print(e)
        db.rollback()
    
    # create shifts
    shifts = [
        {"name": "Morning", "description": "Morning shift", "start_time": datetime.strptime("08:00:00", "%H:%M:%S").time(), "end_time": datetime.strptime("12:00:00", "%H:%M:%S").time()},
        {"name": "Afternoon", "description": "Afternoon shift", "start_time": datetime.strptime("13:00:00", "%H:%M:%S").time(), "end_time": datetime.strptime("17:00:00", "%H:%M:%S").time()},
        {"name": "Evening", "description": "Evening shift", "start_time": datetime.strptime("18:00:00", "%H:%M:%S").time(), "end_time": datetime.strptime("22:00:00", "%H:%M:%S").time()}
    ]
    try:
        for shift_data in shifts:
            shift = models.Shift(**shift_data)
            db.add(shift)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()
    
    # create schedule types
    schedule_types = [
        {"name": "Kidase", "description": "Kidase schedule"},
        {"name": "Meeting", "description": "Meeting schedule"}
    ]
    try:
        for schedule_type_data in schedule_types:
            schedule_type = models.ScheduleType(**schedule_type_data)
            db.add(schedule_type)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()

    # create schedules
    schedules = [
        {
            "date": datetime.now(),
            "description": "Monday morninig kidase",
            "type_id": 1,
            "shift_id": 1,
            "user_id": 2,
            "assigned_by_id": 1,
            "approved_by_id": 1
        },
        {
            "date": datetime.now(),
            "description": "Tuesday morninig kidase",
            "type_id": 1,
            "shift_id": 2,
            "user_id": 2,
            "assigned_by_id": 1,
            "approved_by_id": 1
        }
    ]
    try:
        for schedule_data in schedules:
            schedule = models.Schedule(**schedule_data)
            db.add(schedule)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()

    # Create sample religious documents
    sample_baptism = {
        "serial_number": "BAP-2023-001",
        "english_name": "John Smith",
        "english_father_name": "Michael Smith",
        "english_mother_name": "Sarah Smith",
        "english_christian_name": "John",
        "amharic_name": "ዮሐንስ ስሚዝ",
        "amharic_father_name": "ሚካኤል ስሚዝ",
        "amharic_mother_name": "ሳራ ስሚዝ",
        "amharic_christian_name": "ዮሐንስ",
        "date_of_birth": datetime.now() - timedelta(days=365*20),
        "place_of_birth": "Addis Ababa",
        "address": "Bole, Addis Ababa",
        "phone_number": "0911234567",
        "priest_name": "Priest Name",
        "priest_id": 4,  # Assuming priest user ID
        "amharic_witness_name_1": "ሰላም አበበ",
        "amharic_witness_name_2": "ፍቅር ታደሰ",
        "english_witness_name_1": "Selam Abebe",
        "english_witness_name_2": "Fikir Tadesse",
        "address_witness_1": "Bole, Addis Ababa",
        "address_witness_2": "Piassa, Addis Ababa",
        "recorded_by_id": 1,  # Admin user
        "approved_by_id": 2,  # Manager user
        "baptism_date": datetime.now() - timedelta(days=365*19),
        "baptism_place": "St. Mary Church",
        "amharic_god_parent_name": "ብርሃን ገብረ",
        "english_god_parent_name": "Birhan Gebre"
    }

    try:
        baptism_doc = models.BaptismDocument(**sample_baptism)
        db.add(baptism_doc)
        db.commit()
    except Exception as e:
        print(f"Error creating baptism document: {e}")
        db.rollback()

    # Add more sample documents for other types as needed