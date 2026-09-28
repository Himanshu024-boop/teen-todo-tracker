import React, { useState, useEffect } from 'react';
import { budgetApi } from '../services/api';
import BudgetCard from '../components/BudgetCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { Plus, PieChart, X, ShieldAlert, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Food', 'Transport', 'Education', 'Entertainment',
  'Shopping', 'Gaming', 'Subscriptions', 'Health',
  'Sports', 'Gifts', 'Other'
];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetApi.getBudgets();
      if (res.data?.success) {
        setBudgets(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const openCreateModal = () => {
    setEditingBudget(null);
    setCategory('Food');
    setAmount('');
    setPeriod('monthly');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setCategory(budget.category);
    setAmount(String(budget.amount));
    setPeriod(budget.period || 'monthly');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      setError('Budget amount must be greater than zero.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        category,
        amount: num,
        period
      };

      if (editingBudget) {
        await budgetApi.update(editingBudget.id, payload);
      } else {
        await budgetApi.create(payload);
      }

      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save budget.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await budgetApi.delete(id);
        fetchBudgets();
      } catch (err) {
        console.error('Failed to delete budget:', err);
      }
    }
  };

  const totalAllocated = budgets.reduce((acc, b) => acc + Number(b.amount), 0);
  const totalSpentAcrossBudgets = budgets.reduce((acc, b) => acc + Number(b.spentAmount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Category Budgets 🎯
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set spending limits for your favorite categories and never overspend.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs md:text-sm shadow-md shadow-brand-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Budget Target
        </button>
      </div>

      {/* Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Monthly Allocation
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalAllocated)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Across {budgets.length} budgeted categories</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Actual Spent So Far
          </div>
          <div className="text-2xl font-black text-rose-500 mt-1">
            {formatCurrency(totalSpentAcrossBudgets)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {totalAllocated > 0
              ? `${Math.round((totalSpentAcrossBudgets / totalAllocated) * 100)}% of total budget`
              : 'No limits set'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Remaining Room
          </div>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {formatCurrency(Math.max(0, totalAllocated - totalSpentAcrossBudgets))}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Available before reaching limits</div>
        </div>
      </div>

      {/* Budgets Grid */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="md" text="Loading budgets..." />
        </div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PieChart}
          title="No budgets created yet"
          description="Keep your spending under control by setting simple allowances for Food, Gaming, or Shopping."
          actionText="Create Your First Budget"
          onAction={openCreateModal}
        />
      )}

      {/* Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingBudget ? 'Edit Budget' : 'Set Category Budget'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Category *
                </label>
                <select
                  disabled={Boolean(editingBudget)}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Budget Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    placeholder="e.g., 2000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xl font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Budget Cycle
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="monthly">Monthly Cycle</option>
                  <option value="weekly">Weekly Cycle</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingBudget ? 'Save Changes' : 'Set Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
