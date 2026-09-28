const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Dashboard aggregate endpoint
router.get('/', authMiddleware, dashboardController.getDashboard);

module.exports = router;
