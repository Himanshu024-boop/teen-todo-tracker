const savingsModel = require('../models/savingsModel');

const savingsService = {
  async getGoals(userId) {
    const goals = await savingsModel.find(userId);
    return goals.map(g => {
      const target = Number(g.target_amount);
      const current = Number(g.current_amount);
      const remaining = Math.max(0, target - current);
      const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
      const isCompleted = current >= target;

      return {
        ...g,
        remaining,
        percentage,
        isCompleted
      };
    });
  },

  async getGoalById(id, userId) {
    const goal = await savingsModel.findById(id, userId);
    if (!goal) {
      const error = new Error('Savings goal not found.');
      error.statusCode = 404;
      throw error;
    }
    const target = Number(goal.target_amount);
    const current = Number(goal.current_amount);
    const remaining = Math.max(0, target - current);
    const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

    return {
      ...goal,
      remaining,
      percentage,
      isCompleted: current >= target
    };
  },

  async createGoal(userId, data) {
    return savingsModel.create({
      user_id: userId,
      ...data
    });
  },

  async updateGoal(id, userId, updates) {
    const goal = await savingsModel.update(id, userId, updates);
    if (!goal) {
      const error = new Error('Savings goal not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return goal;
  },

  async addMoney(id, userId, amount) {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      const error = new Error('Added amount must be greater than zero.');
      error.statusCode = 400;
      throw error;
    }
    const updated = await savingsModel.addMoney(id, userId, numAmount);
    if (!updated) {
      const error = new Error('Savings goal not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  },

  async deleteGoal(id, userId) {
    const deleted = await savingsModel.delete(id, userId);
    if (!deleted) {
      const error = new Error('Savings goal not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return { id };
  }
};

module.exports = savingsService;
