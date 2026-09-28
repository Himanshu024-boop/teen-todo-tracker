const { body } = require('express-validator');

const savingsGoalValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Savings goal name is required')
    .isLength({ max: 100 }).withMessage('Goal name cannot exceed 100 characters'),
  body('target_amount')
    .notEmpty().withMessage('Target amount is required')
    .isFloat({ gt: 0 }).withMessage('Target amount must be greater than zero'),
  body('current_amount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Current amount cannot be negative'),
  body('deadline')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('Deadline must be a valid date (YYYY-MM-DD)'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

const addMoneyValidator = [
  body('amount')
    .notEmpty().withMessage('Amount to add is required')
    .isFloat({ gt: 0 }).withMessage('Amount to add must be greater than zero')
];

module.exports = {
  savingsGoalValidator,
  addMoneyValidator
};
