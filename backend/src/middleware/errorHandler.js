const config = require('../config/env');

// 404 Not Found Middleware for undefined routes
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific library errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.code === '23505') { // Postgres unique violation
    statusCode = 409;
    message = 'A record with this unique identifier already exists.';
  } else if (err.code === '23503') { // Postgres foreign key violation
    statusCode = 400;
    message = 'Referenced resource does not exist.';
  }

  // Log error internally in non-test environments
  if (config.nodeEnv !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
    if (statusCode === 500 && err.stack) {
      console.error(err.stack);
    }
  }

  const response = {
    success: false,
    message
  };

  if (config.nodeEnv === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
