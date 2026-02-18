from pydantic import BaseModel, EmailStr
from datetime import datetime

class User(BaseModel):
    id: int
    first_name: str
    email: EmailStr
    created_at: datetime | None = None
    updated_at: datetime | None = None
