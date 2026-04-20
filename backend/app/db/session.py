import os
from sqlmodel import create_engine, Session

# Get base directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Create DB path
DB_PATH = os.path.join(BASE_DIR, "expenses.db")

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False}  # needed for SQLite
)


def get_session():
    with Session(engine) as session:
        yield session