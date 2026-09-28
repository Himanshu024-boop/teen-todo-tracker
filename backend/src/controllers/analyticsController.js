const analyticsService = require('../services/analyticsService');

const analyticsController = {
  async getAnalytics(req, res, next) {
    try {
      const data = await analyticsService.getAnalytics(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = analyticsController;
