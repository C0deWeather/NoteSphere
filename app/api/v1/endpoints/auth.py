from fastapi import APIRouter, Depends, status, HTTPException

from app.schemas.auth import LoginRequest, SignupRequest, LoginResponse
from app.repositories.user_repo import get_user_by_email
from app.deps.api import get_user_repo
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.schemas.users import User

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(
    payload: SignupRequest,
    user_repo = Depends(get_user_repo)) -> dict:
    try:
        password_hash = hash_password(payload.password)
        user_repo.create_user(
            payload.email,
            payload.first_name,
            password_hash
        )

        return {"message": "User created"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    user_repo = Depends(get_user_repo)
) -> LoginResponse:
    user = get_user_by_email(user_repo, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
 
    access_token = create_access_token(user.email)
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=User(
            id=user.id,
            email=user.email,
            first_name=user.first_name
        )
    )