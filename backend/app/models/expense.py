from typing import Optional
from datetime import datetime, date as dt_date
from decimal import Decimal

from sqlmodel import SQLModel, Field


class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    amount: Decimal = Field(nullable=False)
    category: str = Field(nullable=False, index=True)
    description: Optional[str] = None

    date: dt_date = Field(nullable=False, index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    idempotency_key: Optional[str] = Field(default=None, index=True, unique=True)