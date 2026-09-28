const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { expenseValidator } = require('../validators/expenseValidator');

// All expense routes require authentication
router.use(authMiddleware);

router.get('/', expenseController.getExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', expenseValidator, validate, expenseController.createExpense);
router.put('/:id', expenseValidator, validate, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
