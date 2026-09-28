const savingsService = require('../services/savingsService');

const savingsController = {
  async getGoals(req, res, next) {
    try {
      const goals = await savingsService.getGoals(req.user.id);
      res.status(200).json({
        success: true,
        data: goals
      });
    } catch (err) {
      next(err);
    }
  },

  async getGoalById(req, res, next) {
    try {
      const goal = await savingsService.getGoalById(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: goal
      });
    } catch (err) {
      next(err);
    }
  },

  async createGoal(req, res, next) {
    try {
      const newGoal = await savingsService.createGoal(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Savings goal created successfully',
        data: newGoal
      });
    } catch (err) {
      next(err);
    }
  },

  async updateGoal(req, res, next) {
    try {
      const updated = await savingsService.updateGoal(req.params.id, req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Savings goal updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async addMoney(req, res, next) {
    try {
      const { amount } = req.body;
      const updated = await savingsService.addMoney(req.params.id, req.user.id, amount);
      res.status(200).json({
        success: true,
        message: `Added ₹${Number(amount).toLocaleString('en-IN')} to savings goal!`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteGoal(req, res, next) {
    try {
      const result = await savingsService.deleteGoal(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Savings goal deleted successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = savingsController;
