const incomeModel = require('../models/incomeModel');

const incomeService = {
  async getIncome(userId, query) {
    return incomeModel.find(userId, query);
  },

  async getIncomeById(id, userId) {
    const item = await incomeModel.findById(id, userId);
    if (!item) {
      const error = new Error('Income record not found.');
      error.statusCode = 404;
      throw error;
    }
    return item;
  },

  async createIncome(userId, data) {
    return incomeModel.create({
      user_id: userId,
      ...data
    });
  },

  async updateIncome(id, userId, updates) {
    const item = await incomeModel.update(id, userId, updates);
    if (!item) {
      const error = new Error('Income record not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return item;
  },

  async deleteIncome(id, userId) {
    const deleted = await incomeModel.delete(id, userId);
    if (!deleted) {
      const error = new Error('Income record not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return { id };
  },

  async getAllIncome(userId) {
    return incomeModel.getAllForUser(userId);
  }
};

module.exports = incomeService;
