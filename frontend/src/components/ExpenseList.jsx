import React from 'react';
import { formatCurrency, formatDate, getCategoryMeta } from '../utils/formatters';
import { Edit2, Trash2, CreditCard, Tag } from 'lucide-react';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const meta = getCategoryMeta(expense.category);

        return (
          <div
            key={expense.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all gap-3"
          >
            {/* Left: Category Badge & Details */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${meta.bg} ${meta.text}`}
              >
                {expense.category.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate">
                    {expense.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      expense.is_necessary
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {expense.is_necessary ? 'Need' : 'Want'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>{formatDate(expense.expense_date)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    {expense.payment_method}
                  </span>
                  {expense.description && (
                    <>
                      <span>•</span>
                      <span className="italic truncate max-w-[150px] sm:max-w-[200px]">
                        "{expense.description}"
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Amount & Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
              <span className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(expense.amount)}
              </span>

              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit expense"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
