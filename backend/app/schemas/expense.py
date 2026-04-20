from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlmodel import SQLModel


class ExpenseCreate(SQLModel):
    amount: Decimal
    category: str
    description: Optional[str] = None
    date: date

    # optional but useful for retry safety
    idempotency_key: Optional[str] = None


class ExpenseRead(SQLModel):
    id: int
    amount: Decimal
    category: str
    description: Optional[str]
    date: date
    created_at: datetime