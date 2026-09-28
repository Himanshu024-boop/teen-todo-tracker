const budgetService = require('../services/budgetService');

const budgetController = {
  async getBudgets(req, res, next) {
    try {
      const budgets = await budgetService.getBudgets(req.user.id);
      res.status(200).json({
        success: true,
        data: budgets
      });
    } catch (err) {
      next(err);
    }
  },

  async getBudgetById(req, res, next) {
    try {
      const budget = await budgetService.getBudgetById(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: budget
      });
    } catch (err) {
      next(err);
    }
  },

  async createBudget(req, res, next) {
    try {
      const newBudget = await budgetService.createBudget(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: newBudget
      });
    } catch (err) {
      next(err);
    }
  },

  async updateBudget(req, res, next) {
    try {
      const updated = await budgetService.updateBudget(req.params.id, req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteBudget(req, res, next) {
    try {
      const result = await budgetService.deleteBudget(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Budget deleted successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = budgetController;
