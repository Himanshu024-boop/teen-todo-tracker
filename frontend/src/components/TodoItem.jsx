import React from 'react';
import { Check, Calendar, Trash2, Edit2, Clock } from 'lucide-react';
import { formatRelativeDate } from '../utils/formatters';

const TodoItem = ({ todo, onToggleStatus, onEdit, onDelete }) => {
  const { id, title, description, status, priority, due_date, category } = todo;
  const isCompleted = status === 'completed';

  const priorityStyles = {
    high: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    medium: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    low: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900'
  };

  const statusStyles = {
    completed: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    in_progress: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    pending: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
  };

  return (
    <div
      className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Custom Circular Checkbox */}
      <button
        onClick={() => onToggleStatus(id, isCompleted ? 'pending' : 'completed')}
        className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
          isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 dark:hover:border-brand-400 text-transparent hover:text-slate-300'
        }`}
        aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </button>

      {/* Todo Body */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className={`text-sm md:text-base font-semibold text-slate-900 dark:text-white transition-all ${
              isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}
          >
            {title}
          </span>
        </div>

        {description && (
          <p
            className={`text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-2 leading-relaxed ${
              isCompleted ? 'line-through text-slate-400/60 dark:text-slate-600' : ''
            }`}
          >
            {description}
          </p>
        )}

        {/* Badges / Meta */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
          {category && (
            <span className="font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {category}
            </span>
          )}

          <span
            className={`font-semibold px-2 py-0.5 rounded-lg border capitalize ${
              priorityStyles[priority] || priorityStyles.medium
            }`}
          >
            {priority}
          </span>

          <span
            className={`font-semibold px-2 py-0.5 rounded-lg capitalize ${
              statusStyles[status] || statusStyles.pending
            }`}
          >
            {status.replace('_', ' ')}
          </span>

          {due_date && (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatRelativeDate(due_date)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
