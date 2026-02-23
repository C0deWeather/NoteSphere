from pydantic import BaseModel, EmailStr, ConfigDict, Field
from app.schemas.users import User

class SignupRequest(BaseModel):
    first_name: str
    email: EmailStr
    password: str = Field(
        ...,
        min_length=8,
        description="Password must be at least 8 characters long"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "first_name": "John",
                "email": "user@example.com",
                "password": "password123"
            }
        }
    )

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "password": "password123"
            }
        }
    )

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": 1,
                    "first_name": "John Doe",
                    "email": "user@example.com",
                    "created_at": "2023-01-01T00:00:00Z",
                    "updated_at": "2023-01-01T00:00:00Z"
                }
            }
        }
    )
    