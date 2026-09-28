import React from 'react';
import { formatCurrency } from '../utils/formatters';

const StatCard = ({ title, amount, icon: Icon, badge, color = 'brand', subtitle }) => {
  const colorThemes = {
    brand: {
      iconBg: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
      border: 'hover:border-brand-500/30'
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-500/30'
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      border: 'hover:border-rose-500/30'
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-500/30'
    },
    purple: {
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-500/30'
    }
  };

  const theme = colorThemes[color] || colorThemes.brand;

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 hover:shadow-md ${theme.border} group`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${theme.iconBg} transition-transform group-hover:scale-110 duration-200`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {formatCurrency(amount)}
        </div>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
