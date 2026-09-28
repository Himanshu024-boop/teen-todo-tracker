import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Receipt,
  Wallet,
  PieChart,
  Target,
  TrendingUp,
  BookOpen,
  User,
  X,
  Coins
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Daily Tasks', path: '/todos', icon: CheckSquare },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Pocket Money', path: '/income', icon: Wallet },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Savings Goals', path: '/savings', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: TrendingUp },
  { name: 'Financial Literacy', path: '/education', icon: BookOpen },
  { name: 'My Profile', path: '/profile', icon: User },
];

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-400 text-white flex items-center justify-center shadow-glow-indigo transition-transform group-hover:scale-105">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                TeenTrack
              </span>
              <span className="text-[10px] font-semibold text-brand-500 uppercase tracking-widest block">
                Money + Habit
              </span>
            </div>
          </NavLink>

          <button
            onClick={closeSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer tip */}
        <div className="p-4 m-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">
            🎯 Teen Tip of the Day
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            "Pay your future self first! Save 20% before spending pocket money."
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
