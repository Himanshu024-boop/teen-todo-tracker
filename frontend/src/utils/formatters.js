/**
 * Financial & Date Formatting Utilities
 */

export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const formatRelativeDate = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const target = dateStr.split('T')[0];

  if (target === today) return 'Today';
  
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
  if (target === tomorrow) return 'Tomorrow';

  const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
  if (target === yesterday) return 'Yesterday';

  return formatDate(dateStr);
};

export const CATEGORY_COLORS = {
  Food: { bg: 'bg-orange-500/10 dark:bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20', color: '#f97316' },
  Transport: { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', color: '#3b82f6' },
  Education: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', color: '#10b981' },
  Entertainment: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20', color: '#a855f7' },
  Shopping: { bg: 'bg-pink-500/10 dark:bg-pink-500/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/20', color: '#ec4899' },
  Gaming: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20', color: '#6366f1' },
  Subscriptions: { bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20', color: '#06b6d4' },
  Health: { bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20', color: '#f43f5e' },
  Sports: { bg: 'bg-lime-500/10 dark:bg-lime-500/20', text: 'text-lime-600 dark:text-lime-400', border: 'border-lime-500/20', color: '#84cc16' },
  Gifts: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', color: '#f59e0b' },
  Other: { bg: 'bg-slate-500/10 dark:bg-slate-500/20', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20', color: '#64748b' }
};

export const getCategoryMeta = (cat) => {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
};
