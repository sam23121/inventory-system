from fastapi import APIRouter
from .endpoints import users, items, transactions, documents

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"]) 