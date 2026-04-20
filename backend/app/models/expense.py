from typing import Optional
from datetime import datetime, date as dt_date, timezone
from sqlmodel import SQLModel, Field


class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    amount: float = Field(nullable=False)

    category: str = Field(nullable=False, index=True)

    description: Optional[str] = Field(default=None)

    date: dt_date = Field(nullable=False, index=True)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    idempotency_key: str = Field(
        nullable=False,
        index=True,
        unique=True
    )