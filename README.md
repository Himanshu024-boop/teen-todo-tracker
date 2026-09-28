# 🎯 Teen Todo & Personal Expense Tracker

A production-quality web application for teenagers to manage daily tasks, track expenses, set budgets, and build better financial habits.

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** — REST API server
- **Supabase** (PostgreSQL) — Database (falls back to in-memory dev store)
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **express-rate-limit** — Rate limiting
- **Jest** — Unit testing (27 tests passing ✅)

### Frontend
- **React** + **Vite** — UI framework & build tool
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Expense visualization charts
- **Axios** — HTTP client
- **Lucide React** — Icon library

---

## 📁 Project Structure

```
teen-todo-tracker/
├── backend/                  # Express API server
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Data models + devStore
│   │   ├── routes/           # API route definitions
│   │   ├── validators/       # Input validation
│   │   ├── middlewares/      # Auth, error handling
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Server entry point
│   ├── tests/                # Jest test suite
│   └── package.json
│
└── frontend/                 # React + Vite app
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Page views
    │   ├── context/          # Auth + Theme providers
    │   ├── services/         # Axios API service
    │   └── main.jsx          # App entry point
    └── package.json
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone the repo
```bash
git clone https://github.com/Himanshu024-boop/teen-todo-tracker.git
cd teen-todo-tracker
```

### 2. Set up the Backend
```bash
cd backend
npm install
cp .env.example .env      # Add your Supabase keys (optional — works without them)
npm run dev               # Starts on http://localhost:5000
```

### 3. Set up the Frontend
```bash
cd frontend
npm install
npm run dev               # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add expense |
| GET | `/api/budgets` | Get budgets |
| POST | `/api/budgets` | Create budget |
| GET | `/api/savings` | Get savings goals |
| GET | `/api/insights` | Get financial insights |

---

## 🔑 Environment Variables

Create `backend/.env` (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
SUPABASE_URL=your_supabase_url          # Optional
SUPABASE_SERVICE_ROLE_KEY=your_key      # Optional
CLIENT_URL=http://localhost:5173
```

> **Note:** Without Supabase credentials the app runs in **local in-memory mode** with seed data — perfect for development!

---

## ✅ Running Tests

```bash
cd backend
npm test
```

27 unit tests covering Auth, Todos, Expenses, Budgets, and the Financial Insight Service.

---

## 📱 Features

- 📋 **Todo Manager** — Create, complete, and organize daily tasks
- 💸 **Expense Tracker** — Log and categorize every purchase
- 💰 **Income Tracker** — Track allowance, chores, and part-time income
- 📊 **Budget Planner** — Set monthly spending limits per category
- 🎯 **Savings Goals** — Track progress toward things you want
- 📈 **Analytics** — Visual charts of spending patterns (Recharts)
- 🎓 **Money Education** — Age-appropriate financial tips
- 🌙 **Dark Mode** — Full dark/light theme support

---

## 👨‍💻 Author

**Himanshu** — [@Himanshu024-boop](https://github.com/Himanshu024-boop)
