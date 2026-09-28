const expenseModel = require('../models/expenseModel');

const expenseService = {
  async getExpenses(userId, query) {
    return expenseModel.find(userId, query);
  },

  async getExpenseById(id, userId) {
    const expense = await expenseModel.findById(id, userId);
    if (!expense) {
      const error = new Error('Expense not found.');
      error.statusCode = 404;
      throw error;
    }
    return expense;
  },

  async createExpense(userId, data) {
    return expenseModel.create({
      user_id: userId,
      ...data
    });
  },

  async updateExpense(id, userId, updates) {
    const expense = await expenseModel.update(id, userId, updates);
    if (!expense) {
      const error = new Error('Expense not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return expense;
  },

  async deleteExpense(id, userId) {
    const deleted = await expenseModel.delete(id, userId);
    if (!deleted) {
      const error = new Error('Expense not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return { id };
  },

  async getAllExpenses(userId) {
    return expenseModel.getAllForUser(userId);
  }
};

module.exports = expenseService;
