"""This module contains auth dependencies"""

from fastapi import Depends, status, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.deps.api import get_user_repo
from app.services.auth_service import decode_token
from app.db.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    cred: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> User | None:

    if not cred or not cred.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    token = cred.credentials
    try:
        payload = decode_token(token)
        email = payload.get("sub")
        if not email:
            raise ValueError
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    user_repo = get_user_repo()
    user = get_user_by_email(user_repo, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user
