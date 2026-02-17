from fastapi import APIRouter, Depends, status

from app.schemas.auth import LoginRequest, SignupRequest, LoginResponse
from app.deps.auth import get_user_by_email
from app.deps.api import get_user_repo
from app.services.auth import hash_password


router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(
    payload: SignupRequest,
    user_repo = Depends(get_user_repo)) -> dict:
    try:
        password_hash = hash_password(payload.password)
        user_repo.create_user(payload.email, password_hash)

        return {"message": "User created"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        