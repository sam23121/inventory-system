from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Tuple
from ....api.deps import get_db_user
from ....db.session import SessionLocal
from .... import models, schemas
from ....core.security import get_current_user
from ....core.audit import audit_context


router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

######### Root level CRUD operations #########
@router.post("/", response_model=schemas.Schedule)
def create_schedule(
    schedule: schemas.ScheduleCreate,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    with audit_context(db, "CREATE"):
        db_schedule = models.Schedule(**schedule.dict())
        db.add(db_schedule)
        db.commit()
        db.refresh(db_schedule)
        return db_schedule

@router.get("/", response_model=List[schemas.Schedule])
def read_schedules(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    schedules = db.query(models.Schedule).offset(skip).limit(limit).all()
    return schedules

@router.get("/{schedule_id}", response_model=schemas.Schedule)
def read_schedule(schedule_id: int, db: Session = Depends(get_db)):
    db_schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return db_schedule

@router.put("/{schedule_id}", response_model=schemas.Schedule)
def update_schedule(
    schedule_id: int,
    schedule: schemas.ScheduleCreate,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    db_schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    with audit_context(db, "UPDATE"):
        for var, value in vars(schedule).items():
            setattr(db_schedule, var, value)
        db.commit()
        db.refresh(db_schedule)
        return db_schedule

@router.delete("/{schedule_id}")
def delete_schedule(
    schedule_id: int,
    db_user: Tuple[Session, models.User] = Depends(get_db_user)
):
    db, current_user = db_user
    db_schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    with audit_context(db, "DELETE"):
        db.delete(db_schedule)
        db.commit()
        return {"message": "Schedule deleted successfully"}


######### Shifts CRUD operations #########
@router.get("/shifts/", response_model=List[schemas.Shift])
def read_shifts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    shifts = db.query(models.Shift).offset(skip).limit(limit).all()
    return shifts

@router.get("/shifts/{shift_id}", response_model=schemas.Shift)
def read_shift(shift_id: int, db: Session = Depends(get_db)):
    db_shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
    if db_shift is None:
        raise HTTPException(status_code=404, detail="Shift not found")
    return db_shift

@router.post("/shifts/", response_model=schemas.Shift)
def create_shift(shift: schemas.ShiftCreate, db: Session = Depends(get_db)):
    db_shift = models.Shift(**shift.dict())

    db.add(db_shift)
    db.commit()
    db.refresh(db_shift)
    return db_shift

@router.put("/shifts/{shift_id}", response_model=schemas.Shift)
def update_shift(shift_id: int, shift: schemas.ShiftCreate, db: Session = Depends(get_db)):
    db_shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
    if db_shift is None:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    for var, value in vars(shift).items():
        setattr(db_shift, var, value)
    
    db.commit()
    db.refresh(db_shift)
    return db_shift

@router.delete("/shifts/{shift_id}")
def delete_shift(shift_id: int, db: Session = Depends(get_db)):
    db_shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
    if db_shift is None:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    db.delete(db_shift)
    db.commit()
    return {"message": "Shift deleted successfully"}


######### Schedule Types CRUD operations #########
@router.get("/types/", response_model=List[schemas.ScheduleType])
def read_schedule_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    schedule_types = db.query(models.ScheduleType).offset(skip).limit(limit).all()
    return schedule_types

@router.get("/types/{type_id}", response_model=schemas.ScheduleType)
def read_schedule_type(type_id: int, db: Session = Depends(get_db)):
    db_schedule_type = db.query(models.ScheduleType).filter(models.ScheduleType.id == type_id).first()
    if db_schedule_type is None:
        raise HTTPException(status_code=404, detail="Schedule type not found")
    return db_schedule_type

@router.post("/types/", response_model=schemas.ScheduleType)
def create_schedule_type(schedule_type: schemas.ScheduleTypeCreate, db: Session = Depends(get_db)):
    db_schedule_type = models.ScheduleType(**schedule_type.dict())

    db.add(db_schedule_type)
    db.commit()
    db.refresh(db_schedule_type)
    return db_schedule_type

@router.put("/types/{type_id}", response_model=schemas.ScheduleType)
def update_schedule_type(type_id: int, schedule_type: schemas.ScheduleTypeCreate, db: Session = Depends(get_db)):
    db_schedule_type = db.query(models.ScheduleType).filter(models.ScheduleType.id == type_id).first()
    if db_schedule_type is None:
        raise HTTPException(status_code=404, detail="Schedule type not found")
    
    for var, value in vars(schedule_type).items():
        setattr(db_schedule_type, var, value)
    
    db.commit()
    db.refresh(db_schedule_type)
    return db_schedule_type

@router.delete("/types/{type_id}")
def delete_schedule_type(type_id: int, db: Session = Depends(get_db)):
    db_schedule_type = db.query(models.ScheduleType).filter(models.ScheduleType.id == type_id).first()
    if db_schedule_type is None:
        raise HTTPException(status_code=404, detail="Schedule type not found")
    
    db.delete(db_schedule_type)
    db.commit()
    return {"message": "Schedule type deleted successfully"}


######### User's Schedules CRUD operations #########
@router.get("/user/{user_id}", response_model=List[schemas.Schedule])
def read_my_schedules(user_id: int, db: Session = Depends(get_db)):
    # get the current user using security dependency
    schedules = db.query(models.Schedule).filter(models.Schedule.user_id == user_id).all()
    return schedules

