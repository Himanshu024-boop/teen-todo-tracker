import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('teen_tracker_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('teen_tracker_token');
      localStorage.removeItem('teen_tracker_user');
      // If we are not already on the login or register page, redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// Auth Endpoints
// ----------------------------------------------------------------------
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  deleteAccount: () => api.delete('/auth/account'),
};

// ----------------------------------------------------------------------
// Todos Endpoints
// ----------------------------------------------------------------------
export const todoApi = {
  getTodos: (params) => api.get('/todos', { params }),
  getProgress: () => api.get('/todos/progress'),
  getById: (id) => api.get(`/todos/${id}`),
  create: (data) => api.post('/todos', data),
  update: (id, data) => api.put(`/todos/${id}`, data),
  updateStatus: (id, status) => api.patch(`/todos/${id}/status`, { status }),
  delete: (id) => api.delete(`/todos/${id}`),
};

// ----------------------------------------------------------------------
// Expenses Endpoints
// ----------------------------------------------------------------------
export const expenseApi = {
  getExpenses: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// ----------------------------------------------------------------------
// Income Endpoints
// ----------------------------------------------------------------------
export const incomeApi = {
  getIncome: (params) => api.get('/income', { params }),
  getById: (id) => api.get(`/income/${id}`),
  create: (data) => api.post('/income', data),
  update: (id, data) => api.put(`/income/${id}`, data),
  delete: (id) => api.delete(`/income/${id}`),
};

// ----------------------------------------------------------------------
// Budgets Endpoints
// ----------------------------------------------------------------------
export const budgetApi = {
  getBudgets: () => api.get('/budgets'),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// ----------------------------------------------------------------------
// Savings Goals Endpoints
// ----------------------------------------------------------------------
export const savingsApi = {
  getGoals: () => api.get('/savings-goals'),
  getById: (id) => api.get(`/savings-goals/${id}`),
  create: (data) => api.post('/savings-goals', data),
  update: (id, data) => api.put(`/savings-goals/${id}`, data),
  addMoney: (id, amount) => api.patch(`/savings-goals/${id}/add-money`, { amount }),
  delete: (id) => api.delete(`/savings-goals/${id}`),
};

// ----------------------------------------------------------------------
// Dashboard & Analytics
// ----------------------------------------------------------------------
export const dashboardApi = {
  getDashboard: () => api.get('/dashboard'),
};

export const analyticsApi = {
  getAnalytics: (params) => api.get('/analytics', { params }),
};

export default api;
