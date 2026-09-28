import React from 'react';
import { Lightbulb, AlertTriangle, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';

const InsightCard = ({ insight }) => {
  const { title, message, severity, actionPrompt } = insight;

  const severityStyles = {
    high: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60',
      icon: AlertCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
      badgeText: 'Alert'
    },
    medium: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
      badgeText: 'Caution'
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
      badgeText: 'Great Habit'
    },
    info: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60',
      icon: Lightbulb,
      iconColor: 'text-brand-600 dark:text-brand-400',
      badge: 'bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300',
      badgeText: 'Money Coach Tip'
    }
  };

  const style = severityStyles[severity] || severityStyles.info;
  const Icon = style.icon;

  return (
    <div className={`p-4 md:p-5 rounded-2xl border transition-all ${style.bg} relative overflow-hidden group`}>
      <div className="flex items-start gap-3.5">
        <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${style.iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {title}
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
              {style.badgeText}
            </span>
          </div>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {message}
          </p>

          {actionPrompt && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <span>{actionPrompt}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
