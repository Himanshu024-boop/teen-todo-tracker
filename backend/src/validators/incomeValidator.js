const { body } = require('express-validator');

const incomeValidator = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number greater than zero'),
  body('source')
    .trim()
    .notEmpty().withMessage('Income source is required')
    .isLength({ max: 100 }).withMessage('Source cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('income_date')
    .optional()
    .isISO8601().withMessage('Income date must be a valid date (YYYY-MM-DD)')
];

module.exports = {
  incomeValidator
};
