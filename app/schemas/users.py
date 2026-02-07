from pydantic import BaseModel, EmailStr, Optional

class User(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    password: str
    created_at: str = Optional[None]
    updated_at: str = Optional[None]