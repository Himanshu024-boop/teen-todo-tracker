const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { incomeValidator } = require('../validators/incomeValidator');

// All income routes require authentication
router.use(authMiddleware);

router.get('/', incomeController.getIncome);
router.get('/:id', incomeController.getIncomeById);
router.post('/', incomeValidator, validate, incomeController.createIncome);
router.put('/:id', incomeValidator, validate, incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
