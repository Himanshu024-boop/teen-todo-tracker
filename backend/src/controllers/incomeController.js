const incomeService = require('../services/incomeService');

const incomeController = {
  async getIncome(req, res, next) {
    try {
      const list = await incomeService.getIncome(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: list
      });
    } catch (err) {
      next(err);
    }
  },

  async getIncomeById(req, res, next) {
    try {
      const item = await incomeService.getIncomeById(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: item
      });
    } catch (err) {
      next(err);
    }
  },

  async createIncome(req, res, next) {
    try {
      const created = await incomeService.createIncome(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Income added successfully',
        data: created
      });
    } catch (err) {
      next(err);
    }
  },

  async updateIncome(req, res, next) {
    try {
      const updated = await incomeService.updateIncome(req.params.id, req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Income updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteIncome(req, res, next) {
    try {
      const result = await incomeService.deleteIncome(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Income deleted successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = incomeController;
