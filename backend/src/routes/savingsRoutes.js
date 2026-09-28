const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { savingsGoalValidator, addMoneyValidator } = require('../validators/savingsValidator');

// All savings routes require authentication
router.use(authMiddleware);

router.get('/', savingsController.getGoals);
router.get('/:id', savingsController.getGoalById);
router.post('/', savingsGoalValidator, validate, savingsController.createGoal);
router.put('/:id', savingsGoalValidator, validate, savingsController.updateGoal);
router.patch('/:id/add-money', addMoneyValidator, validate, savingsController.addMoney);
router.delete('/:id', savingsController.deleteGoal);

module.exports = router;
