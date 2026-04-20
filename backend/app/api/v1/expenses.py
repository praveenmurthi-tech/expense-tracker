from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from typing import List, Optional

from app.db.session import get_session
from app.schemas.expense import ExpenseCreate, ExpenseRead
from app.crud.expense import create_expense, get_expenses

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", response_model=ExpenseRead)
def create_expense_api(
    expense_in: ExpenseCreate,
    session: Session = Depends(get_session),
):
    return create_expense(session, expense_in)


@router.get("/", response_model=List[ExpenseRead])
def get_expenses_api(
    category: Optional[str] = Query(default=None),
    sort: Optional[str] = Query(default=None),
    session: Session = Depends(get_session),
):
    return get_expenses(session, category, sort)