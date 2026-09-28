const { body } = require('express-validator');

const budgetValidator = [
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters'),
  body('amount')
    .notEmpty().withMessage('Budget amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number greater than zero'),
  body('period')
    .optional()
    .trim()
    .isIn(['weekly', 'monthly']).withMessage('Period must be either "weekly" or "monthly"')
];

module.exports = {
  budgetValidator
};
