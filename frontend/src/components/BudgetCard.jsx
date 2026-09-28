import React from 'react';
import { formatCurrency, getCategoryMeta } from '../utils/formatters';
import { AlertCircle, CheckCircle, Trash2, Edit2 } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { category, budgetAmount, spentAmount, remainingAmount, percentage, isExceeded, period } = budget;
  const meta = getCategoryMeta(category);

  // Status color calculation
  let barColor = 'bg-brand-500';
  let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';

  if (isExceeded) {
    barColor = 'bg-rose-500';
    badgeColor = 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300';
  } else if (percentage >= 80) {
    barColor = 'bg-amber-500';
    badgeColor = 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300';
  } else {
    barColor = 'bg-emerald-500';
    badgeColor = 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300';
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${meta.bg} ${meta.text}`}>
            {category}
          </span>
          <span className="text-[11px] font-medium text-slate-400 capitalize">
            {period}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Budget"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(budget.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete Budget"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xl font-bold text-slate-900 dark:text-white">
          {formatCurrency(spentAmount)}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          of {formatCurrency(budgetAmount)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold px-2 py-0.5 rounded-md ${badgeColor}`}>
          {percentage}% used
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {isExceeded ? (
            <span className="text-rose-500 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" />
              Over by {formatCurrency(spentAmount - budgetAmount)}
            </span>
          ) : (
            <span>{formatCurrency(remainingAmount)} left</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;
