from sqlalchemy import event
from sqlalchemy.orm import Session
from datetime import datetime
import json
from typing import Dict, Any
from .. import models
from contextlib import contextmanager
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import contextvars

current_user = contextvars.ContextVar('current_user', default=None)

class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        user = request.state.user if hasattr(request.state, 'user') else None
        token = current_user.set(user)
        try:
            response = await call_next(request)
            return response
        finally:
            current_user.reset(token)

def serialize_dict(obj_dict: Dict) -> Dict:
    """Serialize dictionary values to JSON-compatible format"""
    result = {}
    for key, value in obj_dict.items():
        if key.startswith('_'):
            continue
        try:
            # Test JSON serialization
            json.dumps({key: value})
            result[key] = value
        except TypeError:
            # Convert non-serializable values to strings
            result[key] = str(value)
    return result

def get_changes(old_obj: Dict, new_obj: Dict) -> Dict[str, Any]:
    changes = {}
    old_obj = serialize_dict(old_obj)
    new_obj = serialize_dict(new_obj)
    for key in new_obj:
        if key in old_obj and old_obj[key] != new_obj[key]:
            changes[key] = {
                'old': old_obj[key],
                'new': new_obj[key]
            }
    return changes

@contextmanager
def audit_context(session: Session, action: str):
    """Context manager for audit operations"""
    try:
        yield
        if session.info.get('audit_data'):
            for audit_entry in session.info['audit_data']:
                session.add(audit_entry)
    except Exception as e:
        session.rollback()
        raise e

def create_audit_log(session: Session, table_name: str, record_id: int, 
                    action: str, changes: Dict = None) -> models.AuditLog:
    user_id = current_user.get().id if current_user.get() else None
    
    audit_log = models.AuditLog(
        table_name=table_name,
        record_id=record_id,
        action=action,
        changes=json.dumps(changes) if changes else None,
        user_id=user_id,
        timestamp=datetime.utcnow()
    )
    
    if 'audit_data' not in session.info:
        session.info['audit_data'] = []
    session.info['audit_data'].append(audit_log)
    
    return audit_log

@event.listens_for(Session, 'before_flush')
def before_flush(session, context, instances):
    for instance in session.new:
        if hasattr(instance, '__tablename__'):
            create_audit_log(
                session=session,
                table_name=instance.__tablename__,
                record_id=instance.id if hasattr(instance, 'id') else None,
                action='CREATE',
                changes=serialize_dict(instance.__dict__)
            )

    for instance in session.dirty:
        if hasattr(instance, '__tablename__'):
            changes = get_changes(
                instance._sa_instance_state.committed_state,
                instance.__dict__
            )
            if changes:
                create_audit_log(
                    session=session,
                    table_name=instance.__tablename__,
                    record_id=instance.id,
                    action='UPDATE',
                    changes=changes
                )

    for instance in session.deleted:
        if hasattr(instance, '__tablename__'):
            create_audit_log(
                session=session,
                table_name=instance.__tablename__,
                record_id=instance.id,
                action='DELETE',
                changes=serialize_dict(instance.__dict__)
            )
