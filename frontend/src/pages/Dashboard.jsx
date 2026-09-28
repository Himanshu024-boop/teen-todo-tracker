import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi, todoApi, expenseApi } from '../services/api';
import StatCard from '../components/StatCard';
import InsightCard from '../components/InsightCard';
import { CategoryDonutChart } from '../components/ExpenseChart';
import ExpenseForm from '../components/ExpenseForm';
import TodoForm from '../components/TodoForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate, getCategoryMeta } from '../utils/formatters';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardApi.getDashboard();
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleTodo = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await todoApi.updateStatus(id, nextStatus);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleExpenseCreated = async (expenseData) => {
    await expenseApi.create(expenseData);
    fetchDashboard();
  };

  const handleTodoCreated = async (todoData) => {
    await todoApi.create(todoData);
    fetchDashboard();
  };

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Gathering your money snapshot..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <div className="p-4 max-w-md mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-sm">
          {error || 'Unable to display dashboard.'}
        </div>
      </div>
    );
  }

  const { summary, categorySpending, recentExpenses, budgetStatus, todoProgress, insights } = data;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Let's manage your money and smash your daily tasks today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTodoModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* 2. Productivity & Money Connection Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-emerald-500/10 border border-brand-200/60 dark:border-brand-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-500 text-white shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Today's Flow: Tasks {todoProgress.percentage}% Done • Spending {formatCurrency(summary.avgDailySpending)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {todoProgress.completedToday} of {todoProgress.totalToday} tasks accomplished today.
            </div>
          </div>
        </div>

        <Link
          to="/todos"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline"
        >
          View all tasks <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3. Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Balance"
          amount={summary.balance}
          icon={Wallet}
          color={summary.balance >= 0 ? 'brand' : 'rose'}
          subtitle={summary.balance >= 0 ? 'Safe to save & budget' : 'Spending exceeds income'}
        />
        <StatCard
          title="Total Income"
          amount={summary.income}
          icon={TrendingUp}
          color="emerald"
          subtitle="Pocket money & earnings"
        />
        <StatCard
          title="Total Expenses"
          amount={summary.expenses}
          icon={TrendingDown}
          color="rose"
          subtitle={`Daily avg: ${formatCurrency(summary.avgDailySpending)}`}
        />
        <StatCard
          title="Total Savings"
          amount={summary.savings}
          icon={Target}
          color="purple"
          badge={summary.savingsRate > 0 ? `${summary.savingsRate}% rate` : null}
          subtitle="Saved towards your goals"
        />
      </div>

      {/* 4. Money Coach Insights Section */}
      {insights && insights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Money Coach Suggestions
            </h3>
            <span className="text-xs text-slate-400 font-medium">Personalized for you</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {insights.slice(0, 2).map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Middle Grid: Spending by Category & Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (Donut Chart) */}
        <div className="lg:col-span-2 p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Spending by Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Where your pocket money is flowing
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Full Analytics →
            </Link>
          </div>

          <CategoryDonutChart data={categorySpending} />
        </div>

        {/* Budget Progress snapshot */}
        <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Budget Targets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Category allowance tracking
                </p>
              </div>
              <Link
                to="/budgets"
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Manage →
              </Link>
            </div>

            <div className="space-y-4">
              {budgetStatus && budgetStatus.length > 0 ? (
                budgetStatus.slice(0, 4).map((b) => (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {b.category}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {formatCurrency(b.spentAmount)} / {formatCurrency(b.budgetAmount)}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          b.isExceeded
                            ? 'bg-rose-500'
                            : b.percentage >= 80
                            ? 'bg-amber-500'
                            : 'bg-brand-500'
                        }`}
                        style={{ width: `${Math.min(100, b.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No budgets set yet. Set a limit for food or gaming!
                </div>
              )}
            </div>
          </div>

          <Link
            to="/budgets"
            className="mt-6 w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors block"
          >
            Adjust Monthly Budgets
          </Link>
        </div>
      </div>

      {/* 6. Bottom Grid: Today's Tasks & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks Preview */}
        <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today's Tasks Preview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tick off tasks as you finish them
              </p>
            </div>
            <Link
              to="/todos"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              All Tasks ({todoProgress.totalToday}) →
            </Link>
          </div>

          <div className="space-y-2.5">
            {todoProgress.pendingTasks && todoProgress.pendingTasks.length > 0 ? (
              todoProgress.pendingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTodo(task.id, task.status)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer transition-all"
                >
                  <div className="w-5 h-5 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                    {task.status === 'completed' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {task.title}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                All tasks completed for today! 🎉 Enjoy your free time.
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Expenses
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest spending activity
              </p>
            </div>
            <Link
              to="/expenses"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentExpenses && recentExpenses.length > 0 ? (
              recentExpenses.map((exp) => {
                const meta = getCategoryMeta(exp.category);
                return (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${meta.bg} ${meta.text}`}
                      >
                        {exp.category.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {exp.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatDate(exp.expense_date)} • {exp.category}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                      {formatCurrency(exp.amount)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent expenses logged.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forms Modals */}
      <ExpenseForm
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleExpenseCreated}
      />

      <TodoForm
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        onSubmit={handleTodoCreated}
      />
    </div>
  );
};

export default Dashboard;
