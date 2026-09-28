const budgetModel = require('../models/budgetModel');
const expenseModel = require('../models/expenseModel');

const budgetService = {
  async getBudgets(userId) {
    const [budgets, expenses] = await Promise.all([
      budgetModel.find(userId),
      expenseModel.getAllForUser(userId)
    ]);

    // Group expenses by category
    const spendingMap = {};
    expenses.forEach(e => {
      const cat = (e.category || 'Other').toLowerCase();
      spendingMap[cat] = (spendingMap[cat] || 0) + Number(e.amount);
    });

    return budgets.map(b => {
      const spent = spendingMap[b.category.toLowerCase()] || 0;
      const budgetAmount = Number(b.amount);
      const remaining = Math.max(0, budgetAmount - spent);
      const percentage = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;
      const isExceeded = spent > budgetAmount;

      return {
        ...b,
        spentAmount: spent,
        remainingAmount: remaining,
        percentage,
        isExceeded
      };
    });
  },

  async getBudgetById(id, userId) {
    const budget = await budgetModel.findById(id, userId);
    if (!budget) {
      const error = new Error('Budget not found.');
      error.statusCode = 404;
      throw error;
    }

    const expenses = await expenseModel.getAllForUser(userId);
    const catExpenses = expenses.filter(e => e.category.toLowerCase() === budget.category.toLowerCase());
    const spent = catExpenses.reduce((acc, e) => acc + Number(e.amount), 0);
    const budgetAmount = Number(budget.amount);

    return {
      ...budget,
      spentAmount: spent,
      remainingAmount: Math.max(0, budgetAmount - spent),
      percentage: budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0,
      isExceeded: spent > budgetAmount
    };
  },

  async createBudget(userId, data) {
    // Check if budget for category and period already exists
    const existing = await budgetModel.findByCategoryAndPeriod(
      userId,
      data.category,
      data.period || 'monthly'
    );
    if (existing) {
      const error = new Error(`A ${data.period || 'monthly'} budget for ${data.category} already exists.`);
      error.statusCode = 409;
      throw error;
    }

    return budgetModel.create({
      user_id: userId,
      ...data
    });
  },

  async updateBudget(id, userId, updates) {
    const budget = await budgetModel.update(id, userId, updates);
    if (!budget) {
      const error = new Error('Budget not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return budget;
  },

  async deleteBudget(id, userId) {
    const deleted = await budgetModel.delete(id, userId);
    if (!deleted) {
      const error = new Error('Budget not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return { id };
  }
};

module.exports = budgetService;
