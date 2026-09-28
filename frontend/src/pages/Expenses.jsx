import React, { useState, useEffect } from 'react';
import { expenseApi } from '../services/api';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import {
  Plus,
  Search,
  Receipt,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  'Food', 'Transport', 'Education', 'Entertainment',
  'Shopping', 'Gaming', 'Subscriptions', 'Health',
  'Sports', 'Gifts', 'Other'
];

const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Bank', 'Other'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [necessity, setNecessity] = useState('all');
  const [page, setPage] = useState(1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        sortBy: 'expense_date',
        sortOrder: 'desc'
      };
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      if (paymentMethod !== 'all') params.payment_method = paymentMethod;
      if (necessity !== 'all') params.is_necessary = necessity;

      const res = await expenseApi.getExpenses(params);
      if (res.data?.success) {
        setExpenses(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, category, paymentMethod, necessity, search]);

  const handleSaveExpense = async (data) => {
    if (editingExpense) {
      await expenseApi.update(editingExpense.id, data);
    } else {
      await expenseApi.create(data);
    }
    fetchExpenses();
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await expenseApi.delete(id);
        fetchExpenses();
      } catch (err) {
        console.error('Failed to delete expense:', err);
      }
    }
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const totalPageSpent = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Personal Expenses 💸
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track every penny, know where your money goes, and spot habits.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs md:text-sm shadow-md shadow-brand-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log Expense
        </button>
      </div>

      {/* Summary Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Page Spending
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(totalPageSpent)}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Logged Records
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {pagination.total} transactions
            </div>
          </div>
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-500">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Average On This Page
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(expenses.length > 0 ? totalPageSpent / expenses.length : 0)}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses by title or note..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Payment Method */}
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Payment Modes</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Necessity */}
          <select
            value={necessity}
            onChange={(e) => {
              setNecessity(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">Needs & Wants</option>
            <option value="true">Needs Only (Essential)</option>
            <option value="false">Wants Only (Lifestyle)</option>
          </select>
        </div>
      </div>

      {/* Expense List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="md" text="Loading expenses..." />
        </div>
      ) : expenses.length > 0 ? (
        <>
          <ExpenseList
            expenses={expenses}
            onEdit={openEditModal}
            onDelete={handleDeleteExpense}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No expenses yet"
          description={
            search || category !== 'all' || paymentMethod !== 'all' || necessity !== 'all'
              ? 'No matching expenses for the selected filter.'
              : 'Start tracking your spending and you will see your financial patterns here.'
          }
          actionText="Log Your First Expense"
          onAction={openCreateModal}
        />
      )}

      {/* Form Modal */}
      <ExpenseForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveExpense}
        initialData={editingExpense}
      />
    </div>
  );
};

export default Expenses;
