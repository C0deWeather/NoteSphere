from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class User():
    id: int
    full_name: str
    email: str
    password_hash: str
    created_at: str = Optional[None]
    updated_at: str = Optional[None]

_next_id = 1
_users_by_email: dict[str, User] = {}

def create_user(email: str, password_hash: str) -> User:
    global _next_id
    if email in _users_by_email:
        raise ValueError("Email already exists")
    user = User(
        id=_next_id,
        email=email,
        password_hash=password_hash,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    _users_by_email[email] = user
    _next_id += 1
    return user

    def get_user_by_email(email: str) -> User | None:
        return _users_by_email.get(email)
        