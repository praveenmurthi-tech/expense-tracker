# 💰 Expense Tracker Backend API

A minimal but production-minded **Expense Tracker backend system** built using **Python (modular backend architecture)** and **SQLite3** as the persistence layer.

This project is designed to be extensible, maintainable, and ready for future full-stack expansion.

---

## 📌 Overview

This backend provides APIs to:

- Create expenses
- List expenses
- Filter by category
- Sort by date (newest first)
- Handle safe retries using **idempotency key**
- Maintain persistent storage using SQLite

---

## 🏗️ Project Structure

```

.
├── app
│   ├── api/v1/expenses.py     # API routes (POST, GET expenses)
│   ├── core/config.py         # App configuration
│   ├── crud/expense.py        # Database operations layer
│   ├── db/
│   │   ├── base.py            # DB setup
│   │   └── session.py         # SQLite session/connection
│   ├── models/expense.py      # Database model
│   ├── schemas/expense.py     # Request/response validation
│   └── main.py                # App entry point
├── db.sqlite3                 # SQLite database file
├── expenses.db                # Backup DB file
├── requirements.txt
└── README.md

````

---

## ⚙️ Tech Stack

- **Backend:** Python
- **Architecture:** Modular layered design (API → CRUD → DB)
- **Database:** SQLite3
- **Data Layer:** CRUD abstraction
- **Validation:** Schema-based request validation

---

## 🗄️ Database Schema

### Table: `expense`

```sql
CREATE TABLE expense (
    id INTEGER NOT NULL PRIMARY KEY,
    amount NUMERIC NOT NULL,
    category VARCHAR NOT NULL,
    description VARCHAR,
    date DATE NOT NULL,
    created_at DATETIME NOT NULL,
    idempotency_key VARCHAR
);
````

---

### 📊 Indexes

```sql
CREATE INDEX ix_expense_category ON expense (category);
CREATE INDEX ix_expense_date ON expense (date);
CREATE UNIQUE INDEX ix_expense_idempotency_key ON expense (idempotency_key);
```

---

## 🔐 Design Decisions

### 💰 amount (NUMERIC)

Used instead of FLOAT to ensure precision for financial calculations.

---

### 🔁 idempotency_key

Prevents duplicate expense creation when:

* Network retries happen
* User refreshes page
* Frontend resubmits request

👉 If the same request is received again with the same key, the existing record is returned instead of creating a new one.

---

### 📌 Index Strategy

* category index → fast filtering
* date index → optimized sorting (`date_desc`)
* unique idempotency_key → guarantees request deduplication

---

## 🗄️ Why SQLite?

We chose **SQLite3** because:

* Zero configuration database
* Ideal for local development
* Lightweight and fast for CRUD workloads
* File-based persistence
* Easy migration path to PostgreSQL later

👉 Can be upgraded to:

* PostgreSQL (recommended for production)
* MySQL
* AWS RDS / Azure Database

---

## 🚀 API Endpoints

---

### ➕ Create Expense

```
POST /expenses
```

#### Request Body

```json
{
  "amount": 250.75,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2026-04-20"
}
```

#### Behavior

* Creates a new expense
* Supports retry-safe behavior using `idempotency_key`
* Stores timestamps automatically

---

### 📄 Get Expenses

```
GET /expenses
```

#### Query Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| category  | string | Filter by category            |
| sort      | string | `date_desc` (default sorting) |

---

#### Example

```
GET /expenses?category=Food&sort=date_desc
```

---

## 📊 Data Model

| Field           | Type     | Description                 |
| --------------- | -------- | --------------------------- |
| id              | integer  | Unique identifier           |
| amount          | numeric  | Expense amount (money-safe) |
| category        | string   | Expense category            |
| description     | string   | Expense description         |
| date            | date     | Expense date                |
| created_at      | datetime | Record creation timestamp   |
| idempotency_key | string   | Retry protection key        |

---

## 🔄 Idempotency Handling

To ensure safe retries:

* Each request can carry an `idempotency_key`
* Duplicate requests with same key will not create new records
* Enforced at database level using **unique constraint**

---

## 🧪 Running the Project

### 1. Clone Repository

```bash
git clone https://github.com/praveenmurthi-tech/expense-tracker.git
cd expense-tracker
```

---

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Run Server

```bash
uvicorn app.main:app --reload
```

Server runs at:

```
http://localhost:8000
```

---

## 📦 Example Usage

### Create Expense

```bash
curl -X POST http://localhost:8000/expenses \
-H "Content-Type: application/json" \
-d '{
  "amount": 100,
  "category": "Transport",
  "description": "Uber ride",
  "date": "2026-04-20"
}'
```

---

### Fetch Expenses

```bash
curl http://localhost:8000/expenses?sort=date_desc
```

---

## 📈 Future Improvements

* JWT Authentication
* Pagination support
* Monthly analytics endpoints
* Category-wise breakdown charts
* Docker containerization
* PostgreSQL migration
* CI/CD pipeline (GitHub Actions)

---

## 👨‍💻 Author

**Praveen Murthi**

* GitHub: [https://github.com/your-profile](https://github.com/your-profile)
* LinkedIn: [https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

---

## 📜 License

MIT License — free to use and extend.

[https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

```

---

If you want next upgrade, I can also:
- 🔥 :contentReference[oaicite:0]{index=0}
- 🔥 :contentReference[oaicite:1]{index=1}
- 🔥 Or :contentReference[oaicite:2]{index=2}