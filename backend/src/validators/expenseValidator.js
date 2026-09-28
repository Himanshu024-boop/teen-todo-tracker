const { body } = require('express-validator');

const VALID_CATEGORIES = [
  'Food', 'Transport', 'Education', 'Entertainment',
  'Shopping', 'Gaming', 'Subscriptions', 'Health',
  'Sports', 'Gifts', 'Other'
];

const VALID_PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Bank', 'Other'];

const expenseValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Expense title is required')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number greater than zero'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('payment_method')
    .trim()
    .notEmpty().withMessage('Payment method is required')
    .isIn(VALID_PAYMENT_METHODS).withMessage(`Payment method must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`),
  body('expense_date')
    .optional()
    .isISO8601().withMessage('Expense date must be a valid date (YYYY-MM-DD)'),
  body('is_necessary')
    .optional()
    .isBoolean().withMessage('is_necessary must be a boolean')
];

module.exports = {
  expenseValidator,
  VALID_CATEGORIES,
  VALID_PAYMENT_METHODS
};
