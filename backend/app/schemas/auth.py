from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    phone_number: Optional[str] = None
