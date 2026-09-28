import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Target, Plus, CheckCircle, Calendar, Trash2, Edit2 } from 'lucide-react';

const SavingsGoalCard = ({ goal, onAddMoney, onEdit, onDelete }) => {
  const [showAddInput, setShowAddInput] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');

  const { id, name, target_amount, current_amount, deadline, description, percentage, isCompleted, remaining } = goal;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!amountToAdd || Number(amountToAdd) <= 0) return;
    onAddMoney(id, Number(amountToAdd));
    setAmountToAdd('');
    setShowAddInput(false);
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-500/10 text-brand-500'}`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {name}
              </h4>
              {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(goal)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Goal"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete Goal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Financial progress */}
        <div className="mt-4 mb-2 flex items-baseline justify-between">
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(current_amount)}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Target: {formatCurrency(target_amount)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-brand-500 to-indigo-400'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
          <span className="font-bold text-brand-600 dark:text-brand-400">
            {percentage}% Saved
          </span>
          <span>
            {isCompleted ? (
              <span className="text-emerald-500 font-semibold">Goal Reached! 🎉</span>
            ) : (
              `${formatCurrency(remaining)} to go`
            )}
          </span>
        </div>

        {deadline && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>Target Date: {formatDate(deadline)}</span>
          </div>
        )}
      </div>

      {/* Add Money Action Area */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        {!showAddInput ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddInput(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-600 dark:text-brand-400 text-xs font-bold transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Savings
            </button>
            <button
              onClick={() => onAddMoney(id, 100)}
              className="py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            >
              +₹100
            </button>
            <button
              onClick={() => onAddMoney(id, 500)}
              className="py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            >
              +₹500
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              step="any"
              placeholder="Amount (₹)"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              className="flex-1 py-1.5 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              autoFocus
            />
            <button
              type="submit"
              className="py-1.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddInput(false)}
              className="py-1.5 px-2 rounded-xl text-slate-400 hover:text-slate-600 text-xs"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SavingsGoalCard;
