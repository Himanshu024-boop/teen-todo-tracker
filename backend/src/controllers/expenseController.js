const expenseService = require('../services/expenseService');

const expenseController = {
  async getExpenses(req, res, next) {
    try {
      const result = await expenseService.getExpenses(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  },

  async getExpenseById(req, res, next) {
    try {
      const expense = await expenseService.getExpenseById(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: expense
      });
    } catch (err) {
      next(err);
    }
  },

  async createExpense(req, res, next) {
    try {
      const newExpense = await expenseService.createExpense(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: newExpense
      });
    } catch (err) {
      next(err);
    }
  },

  async updateExpense(req, res, next) {
    try {
      const updated = await expenseService.updateExpense(req.params.id, req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteExpense(req, res, next) {
    try {
      const result = await expenseService.deleteExpense(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = expenseController;
