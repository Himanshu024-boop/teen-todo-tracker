const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { budgetValidator } = require('../validators/budgetValidator');

// All budget routes require authentication
router.use(authMiddleware);

router.get('/', budgetController.getBudgets);
router.get('/:id', budgetController.getBudgetById);
router.post('/', budgetValidator, validate, budgetController.createBudget);
router.put('/:id', budgetValidator, validate, budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
