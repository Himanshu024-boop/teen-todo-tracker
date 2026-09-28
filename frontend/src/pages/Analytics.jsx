import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';
import {
  CategoryDonutChart,
  SpendingTrendChart,
  CategoryBarChart,
  IncomeVsExpenseChart
} from '../components/ExpenseChart';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Award,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const TIMEFRAMES = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last 1 Year', value: '1y' }
];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsApi.getAnalytics({ timeframe });
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Computing your financial analytics..." />
      </div>
    );
  }

  if (!data) return null;

  const { summary, categorySpending, dailyTrend, needsVsWants, paymentMethodBreakdown } = data;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Expense Analytics 📊
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual breakdown of your habits, trends, and financial patterns.
          </p>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === tf.value
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Spending"
          amount={summary.totalSpending}
          icon={TrendingDown}
          color="rose"
          subtitle={`Across ${data.dateRange?.startDate} to ${data.dateRange?.endDate}`}
        />
        <StatCard
          title="Daily Spending Avg"
          amount={summary.avgDailySpending}
          icon={Calendar}
          color="brand"
          subtitle="Paced spending per day"
        />
        <StatCard
          title="Largest Single Expense"
          amount={summary.largestExpense ? summary.largestExpense.amount : 0}
          icon={Award}
          color="amber"
          subtitle={summary.largestExpense ? summary.largestExpense.title : 'None recorded'}
        />
        <StatCard
          title="Top Category"
          amount={categorySpending.length > 0 ? categorySpending[0].amount : 0}
          icon={ShoppingBag}
          color="purple"
          badge={summary.topCategory}
          subtitle={categorySpending.length > 0 ? `${categorySpending[0].percentage}% of total spent` : 'None'}
        />
      </div>

      {/* Charts Grid Row 1: Spending Over Time & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Spending Over Time
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily spending curve across the selected period
            </p>
          </div>
          <SpendingTrendChart data={dailyTrend} />
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proportion of spending per category
            </p>
          </div>
          <CategoryDonutChart data={categorySpending} />
        </div>
      </div>

      {/* Charts Grid Row 2: Category Comparison & Income vs Expense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Side-by-side total amounts spent by category
            </p>
          </div>
          <CategoryBarChart data={categorySpending} />
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Income vs Expenses
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparison of inflow vs outflow
            </p>
          </div>
          <IncomeVsExpenseChart data={dailyTrend} />
        </div>
      </div>

      {/* Row 3: Needs vs Wants & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs vs Wants Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Needs vs Wants Balance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Smart financial habits start by balancing essentials and desires
            </p>
          </div>

          <div className="space-y-4">
            {needsVsWants.map((item, idx) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {formatCurrency(item.amount)} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? 'bg-emerald-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            💡 <strong>Smart Rule of Thumb:</strong> Aim for approximately 50% Needs, 30% Wants, and 20% Savings!
          </p>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Payment Methods Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              UPI, Cash, Card, and Bank transaction distribution
            </p>
          </div>

          <div className="space-y-3">
            {paymentMethodBreakdown.map((pm) => (
              <div
                key={pm.method}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {pm.method}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(pm.amount)}
                  </span>
                  <span className="ml-2 text-slate-400">({pm.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
