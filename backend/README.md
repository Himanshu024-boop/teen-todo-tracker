# 🚀 Teen Todo & Expense Tracker — Backend API

A production-quality **Node.js + Express** REST API powering the Teen Todo & Personal Expense Tracker application. Built for teenagers to manage tasks, track expenses, set budgets, and build healthy financial habits.

---

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework & REST API |
| **Supabase (PostgreSQL)** | Primary database |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcryptjs** | Secure password hashing |
| **express-validator** | Input validation & sanitization |
| **express-rate-limit** | API rate limiting / DDoS protection |
| **Jest** | Unit & integration testing |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                        # Express app setup, middleware registration
│   ├── server.js                     # HTTP server entry point
│   ├── controllers/
│   │   ├── authController.js         # Register / Login / Profile
│   │   ├── todoController.js         # CRUD for todos
│   │   ├── expenseController.js      # CRUD for expenses
│   │   ├── incomeController.js       # CRUD for income entries
│   │   ├── budgetController.js       # CRUD for budgets
│   │   ├── savingsController.js      # Savings goals management
│   │   └── insightController.js      # Financial insight generation
│   ├── services/
│   │   ├── authService.js            # Auth business logic
│   │   ├── todoService.js            # Todo business logic
│   │   ├── expenseService.js         # Expense business logic
│   │   ├── budgetService.js          # Budget business logic
│   │   └── financialInsightService.js# AI-style money coaching logic
│   ├── models/
│   │   ├── userModel.js              # User schema & queries
│   │   ├── todoModel.js              # Todo schema & queries
│   │   ├── expenseModel.js           # Expense schema & queries
│   │   ├── incomeModel.js            # Income schema & queries
│   │   ├── budgetModel.js            # Budget schema & queries
│   │   ├── savingsModel.js           # Savings schema & queries
│   │   └── devStore.js               # In-memory fallback store (dev mode)
│   ├── routes/
│   │   ├── authRoutes.js             # POST /api/auth/register, /login
│   │   ├── todoRoutes.js             # /api/todos
│   │   ├── expenseRoutes.js          # /api/expenses
│   │   ├── incomeRoutes.js           # /api/income
│   │   ├── budgetRoutes.js           # /api/budgets
│   │   ├── savingsRoutes.js          # /api/savings
│   │   └── insightRoutes.js          # /api/insights
│   ├── validators/
│   │   ├── authValidator.js          # Register/login input rules
│   │   ├── todoValidator.js          # Todo input rules
│   │   └── expenseValidator.js       # Expense input rules
│   └── middlewares/
│       ├── authMiddleware.js         # JWT verification
│       └── errorMiddleware.js        # Global error handler
├── database/
│   ├── schema.sql                    # PostgreSQL table definitions
│   └── seed.sql                      # Sample seed data
├── tests/
│   ├── auth.test.js                  # Auth unit tests
│   ├── todos.test.js                 # Todo unit tests
│   ├── expenses.test.js              # Expense unit tests
│   ├── budgets.test.js               # Budget unit tests
│   └── financialInsight.test.js      # Insight service tests
├── .env.example                      # Template for environment variables
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- A [Supabase](https://supabase.com) account *(optional — app works without it in dev mode)*

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
PORT=5000
NODE_ENV=development

# Auth
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Supabase (optional — leave blank for local dev mode)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# CORS
CLIENT_URL=http://localhost:5173
```

> 💡 **Dev Mode:** If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are not set, the app automatically switches to an **in-memory store** with pre-loaded seed data. No database setup required!

### 3. Start the development server

```bash
npm run dev
```

The API will be available at **http://localhost:5000**

---

## 🌐 API Reference

### Base URL
```
http://localhost:5000/api
```

### 🔐 Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | `{ name, email, password, age }` | Register a new user |
| `POST` | `/auth/login` | `{ email, password }` | Login & receive JWT token |
| `GET` | `/auth/profile` | — | Get current user profile (🔒 auth required) |
| `PUT` | `/auth/profile` | `{ name, age }` | Update profile (🔒 auth required) |

### ✅ Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/todos` | Get all todos for current user |
| `POST` | `/todos` | Create a new todo |
| `PUT` | `/todos/:id` | Update a todo |
| `PATCH` | `/todos/:id/toggle` | Toggle todo completion |
| `DELETE` | `/todos/:id` | Delete a todo |

### 💸 Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/expenses` | Get all expenses |
| `GET` | `/expenses/summary` | Get category-wise summary |
| `POST` | `/expenses` | Add a new expense |
| `PUT` | `/expenses/:id` | Update an expense |
| `DELETE` | `/expenses/:id` | Delete an expense |

### 💰 Income

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/income` | Get all income entries |
| `POST` | `/income` | Add income entry |
| `DELETE` | `/income/:id` | Delete income entry |

### 📊 Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/budgets` | Get all budgets |
| `POST` | `/budgets` | Create a budget |
| `PUT` | `/budgets/:id` | Update a budget |
| `DELETE` | `/budgets/:id` | Delete a budget |

### 🎯 Savings Goals

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/savings` | Get all savings goals |
| `POST` | `/savings` | Create a savings goal |
| `PUT` | `/savings/:id` | Update a savings goal |
| `DELETE` | `/savings/:id` | Delete a savings goal |

### 🧠 Financial Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/insights` | Get AI-style money coaching insights |
| `GET` | `/health` | Health check endpoint |

---

## 🔒 Authentication

All protected routes require a **Bearer token** in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued on login and expire after **7 days** by default.

---

## ✅ Running Tests

```bash
npm test
```

**27 tests** covering:

| Test File | Tests | What's Covered |
|-----------|-------|----------------|
| `auth.test.js` | 6 | Register, login, duplicate email, invalid credentials |
| `todos.test.js` | 5 | CRUD, toggle completion, validation |
| `expenses.test.js` | 6 | Add, list, summary, delete, category validation |
| `budgets.test.js` | 5 | Create, update, over-budget detection |
| `financialInsight.test.js` | 5 | Insight generation, spending patterns, suggestions |

```bash
# Run with coverage report
npm test -- --coverage
```

---

## 🛡️ Security Features

- ✅ **JWT Authentication** — Stateless, signed tokens
- ✅ **Password Hashing** — bcryptjs with salt rounds = 12
- ✅ **Rate Limiting** — 100 req/15min global, 10 req/15min on auth routes
- ✅ **Input Validation** — express-validator on all POST/PUT routes
- ✅ **CORS** — Configured to only allow the frontend origin
- ✅ **Helmet** — HTTP security headers
- ✅ **Error Handling** — Centralized error middleware, no stack traces in production

---

## 📊 Database Schema (Supabase / PostgreSQL)

```sql
users         — id, name, email, password_hash, age, created_at
todos         — id, user_id, title, description, priority, due_date, completed
expenses      — id, user_id, amount, category, description, date
income        — id, user_id, amount, source, description, date
budgets       — id, user_id, category, monthly_limit, month
savings_goals — id, user_id, title, target_amount, current_amount, target_date
```

See [`database/schema.sql`](./database/schema.sql) for the full schema with constraints and indexes.

---

## 🔧 Available Scripts

```bash
npm run dev       # Start with nodemon (auto-restart on changes)
npm start         # Start production server
npm test          # Run Jest test suite
npm run lint      # Lint source files
```

---

## 👨‍💻 Author

**Himanshu** — [@Himanshu024-boop](https://github.com/Himanshu024-boop)

---

## 📄 License

MIT License — free to use, modify, and distribute.
