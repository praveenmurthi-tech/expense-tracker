# 💰 Expense Tracker (React + Vite + TypeScript)

A modern, production-ready **Expense Tracker web application** built using **React (Vite) + TypeScript + Tailwind CSS + shadcn/ui**.
It allows users to track expenses, categorize spending, and analyze totals with a clean and responsive UI.

---

## 📋 Table of Contents

- [Live Features](#-live-features)
  - [Core Features](#-core-features)
  - [Smart UX & Validation](#-smart-ux--validation)
  - [Anti-Duplicate Submission System](#️-anti-duplicate-submission-system)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Key Implementation Details](#️-key-implementation-details)
- [UI Overview](#-ui-overview)
- [Architecture Notes](#-architecture-notes)
- [Future Enhancements](#-future-enhancements)
- [Setup & Installation](#️-setup--installation)
- [Author](#-author)
- [License](#-license)
- [Summary](#-summary)

---

## 🚀 [Live Features](#-live-features)

### 📌 [Core Features](#-core-features)

* ➕ Add expenses (amount, category, description, date)
* 📋 View all expenses in a structured table
* 🔍 Filter by category
* 🔃 Sort by date and amount
* 💰 Live total expense calculation
* 📅 Date picker with validation (no future dates)
* ⚡ Loading skeleton states
* 🔔 Toast notifications for success/error states

---

### 🧠 [Smart UX & Validation](#-smart-ux--validation)

* 🚫 Prevents invalid amount input (non-numeric, multi-decimal protection)
* ✂️ Auto trims and sanitizes description input
* ⛔ Blocks leading whitespace input
* 🧹 Prevents empty or invalid submissions
* 🧊 Prevents duplicate submissions (UI-level lock)

---

### 🛡️ [Anti-Duplicate Submission System](#️-anti-duplicate-submission-system)

This project implements a **multi-layer protection system**:

* `useRef` submission lock (instant blocking)
* Button disabling during API call
* Pointer-event blocking for extra safety
* Idempotency key support (backend-safe)
* Controlled state reset after success

---

## 🏗️ [Tech Stack](#️-tech-stack)

| Layer         | Technology      |
| ------------- | --------------- |
| Frontend      | React 18 + Vite |
| Language      | TypeScript      |
| Styling       | Tailwind CSS    |
| UI Kit        | shadcn/ui       |
| Icons         | Lucide React    |
| Date Utility  | date-fns        |
| Notifications | sonner          |
| API Handling  | Fetch API       |

---

## 📁 [Project Structure](#-project-structure)

```
expense-tracker/
│
├── public/
├── src/
│   ├── components/        # UI components (shadcn based)
│   ├── lib/               # Utility functions (cn, helpers)
│   ├── pages/             # Main Expense Tracker page
│   ├── hooks/             # Custom hooks
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🔌 [API Integration](#-api-integration)

### Base URL

```ts
http://127.0.0.1:8000/api/v1/expenses/
```

---

### 📥 Get Expenses

```http
GET /expenses/
```

---

### ➕ Create Expense

```http
POST /expenses/
```

```json
{
  "idempotency_key": "uuid",
  "amount": 250.5,
  "category": "Food & Dining",
  "description": "Lunch with team",
  "date": "2026-04-20"
}
```

---

## ⚙️ [Key Implementation Details](#️-key-implementation-details)

### 1. Expense State Management

* Uses `useState` for form and list management
* Uses `useMemo` for filtered + sorted data
* Prevents unnecessary re-renders

---

### 2. Form Validation Layer

Inside `handleSubmit`:

* Prevents empty amount
* Ensures numeric input
* Blocks whitespace-only description
* Validates category selection

---

### 3. Duplicate Submission Prevention

```ts
if (submittingRef.current) return;
submittingRef.current = true;
```

Combined with:

* disabled button
* pointer-events blocking
* backend idempotency key

---

### 4. Input Sanitization

#### Amount Field:

* Only numbers + one decimal allowed
* Max 2 decimal precision
* Removes invalid characters

#### Description Field:

* Removes special characters
* Blocks leading spaces
* Trims on blur

---

### 5. Date Handling

* Uses `date-fns`
* Formats as `PPP`
* Prevents future dates selection

---

## 📊 [UI Overview](#-ui-overview)

### Expense Form

* Clean card layout
* Input validation in real-time
* Calendar-based date picker

### Expense Table

* Skeleton loading state
* Responsive table layout
* Empty state handling
* Currency formatting

---

## 🧠 [Architecture Notes](#-architecture-notes)

This project is designed with:

* Component modularity (shadcn/ui system)
* Controlled inputs for all form fields
* Performance optimization using memoization
* API-driven architecture (no local persistence)
* Strong UX safety layers

---

## 🚀 [Future Enhancements](#-future-enhancements)

* 📊 Analytics dashboard (charts & graphs)
* 💾 Local storage fallback mode
* 🔐 Authentication system
* ☁️ Cloud deployment (Vercel + backend hosting)
* 📱 Mobile PWA support
* 🏷️ Custom category creation
* 📥 Export to CSV/PDF

---

## 🛠️ [Setup & Installation](#️-setup--installation)

### 1. Install dependencies

```bash
npm install
```

---

### 2. Run development server

```bash
npm run dev
```

---

### 3. Build for production

```bash
npm run build
```

---

### 4. Preview production build

```bash
npm run preview
```

---

## 👨‍💻 [Author](#-author)

**Praveen Murthi**

---

## 📜 [License](#-license)

This project is licensed under the MIT License.

---

## ⭐ [Summary](#-summary)

This is a **production-grade expense tracking frontend** with:

* strong UX validation
* duplicate-safe submission system
* clean UI architecture
* scalable React structure