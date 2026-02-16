from fastapi import APIRouter

from app.schemas.auth import LoginRequest, SignupRequest, LoginResponse
from app.db.models.user import create_user, get_user_by_email, User

router = APIRouter()

@router.post("/signup")
async def signup(payload: SignupRequest) -> dict:
    