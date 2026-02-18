from dataclasses import dataclass, field
from app.db.models.user import User
from datetime import datetime, timezone


@dataclass
class InappTempMemory:
    next_id = 1
    users_by_email: dict[str, User] = field(default_factory=dict)

    def create_user(
        self,
        email: str,
        first_name: str,
        password_hash: str) -> User:
        if email in self.users_by_email:
            raise ValueError("Email already exists")

        now = datetime.now(timezone.utc)
        user = User(
            id=self.next_id,
            first_name=first_name,
            email=email,
            password_hash=password_hash,
            created_at=now,
            updated_at=now
        )
        self.users_by_email[email] = user
        self.next_id += 1
        return user
        