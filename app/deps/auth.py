"""This module contains auth dependencies"""

from app.repositories.user_repo import InappTempMemory
from app.db.models.user import User


def get_user_by_email(self, email: str) -> User | None:
    return InappTempMemory.users_by_email.get(email)
