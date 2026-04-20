from sqlmodel import Session, select
from typing import List, Optional

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate


def create_expense(session: Session, expense_in: ExpenseCreate) -> Expense:
    # ✅ Idempotency check
    if expense_in.idempotency_key:
        existing = session.exec(
            select(Expense).where(
                Expense.idempotency_key == expense_in.idempotency_key
            )
        ).first()

        if existing:
            return existing

    expense = Expense.from_orm(expense_in)

    session.add(expense)
    session.commit()
    session.refresh(expense)

    return expense


def get_expenses(
    session: Session,
    category: Optional[str] = None,
    sort: Optional[str] = None,
) -> List[Expense]:
    query = select(Expense)

    # 🔍 Filter
    if category:
        query = query.where(Expense.category == category)

    # 🔽 Sort
    if sort == "date_desc":
        query = query.order_by(Expense.date.desc())

    return session.exec(query).all()