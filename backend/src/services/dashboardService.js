const expenseModel = require('../models/expenseModel');
const incomeModel = require('../models/incomeModel');
const budgetModel = require('../models/budgetModel');
const savingsModel = require('../models/savingsModel');
const todoModel = require('../models/todoModel');
const financialInsightService = require('./financialInsightService');

const dashboardService = {
  async getDashboardData(userId) {
    const [expenses, income, budgets, savingsGoals, todos] = await Promise.all([
      expenseModel.getAllForUser(userId),
      incomeModel.getAllForUser(userId),
      budgetModel.find(userId),
      savingsModel.find(userId),
      todoModel.find(userId)
    ]);

    // Financial calculations
    const totalIncome = income.reduce((acc, i) => acc + Number(i.amount), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
    const balance = totalIncome - totalExpenses;
    const totalSavedInGoals = savingsGoals.reduce((acc, s) => acc + Number(s.current_amount), 0);

    // Savings rate safely handled
    const savingsRate = totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 1000) / 10)
      : 0;

    // Time-based averages
    // Consider expenses within the last 30 days or available days
    const daysTracked = Math.max(1, 30);
    const avgDailySpending = Math.round((totalExpenses / daysTracked) * 100) / 100;
    const avgWeeklySpending = Math.round((avgDailySpending * 7) * 100) / 100;
    const avgMonthlySpending = Math.round(totalExpenses * 100) / 100;

    // Category spending aggregation
    const categoryTotals = {};
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
    });

    const categorySpending = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const highestSpendingCategory = categorySpending.length > 0 ? categorySpending[0].category : 'None';

    // Largest single expense
    let largestSingleExpense = null;
    if (expenses.length > 0) {
      const sortedByAmount = [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount));
      largestSingleExpense = {
        title: sortedByAmount[0].title,
        amount: Number(sortedByAmount[0].amount),
        category: sortedByAmount[0].category,
        expense_date: sortedByAmount[0].expense_date
      };
    }

    // Recent 5 expenses
    const recentExpenses = expenses.slice(0, 5);

    // Budget status
    const budgetStatus = budgets.map(b => {
      const spent = categoryTotals[b.category] || 0;
      const budgetAmount = Number(b.amount);
      const remaining = Math.max(0, budgetAmount - spent);
      const percentage = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;
      return {
        id: b.id,
        category: b.category,
        budgetAmount,
        spentAmount: spent,
        remainingAmount: remaining,
        percentage,
        isExceeded: spent > budgetAmount
      };
    });

    // Todo today preview
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysTasks = todos.filter(t => t.due_date === todayStr || (t.completed_at && t.completed_at.startsWith(todayStr)));
    const totalToday = todaysTasks.length;
    const completedToday = todaysTasks.filter(t => t.status === 'completed').length;
    const todoPercentage = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

    const pendingTasks = todos
      .filter(t => t.status !== 'completed')
      .slice(0, 4);

    // Financial Insights (Money Coach)
    const insights = financialInsightService.generateInsights({
      income,
      expenses,
      budgets,
      savingsGoals
    });

    return {
      summary: {
        income: totalIncome,
        expenses: totalExpenses,
        balance,
        savings: totalSavedInGoals || (balance > 0 ? balance : 0),
        savingsRate,
        avgDailySpending,
        avgWeeklySpending,
        avgMonthlySpending,
        highestSpendingCategory,
        largestSingleExpense
      },
      categorySpending,
      recentExpenses,
      budgetStatus,
      todoProgress: {
        totalToday,
        completedToday,
        percentage: todoPercentage,
        pendingTasks
      },
      insights
    };
  }
};

module.exports = dashboardService;
