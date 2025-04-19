// middleware/errorHandler.js

/**
 * Simplified error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Simple console logging instead of logger

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Handle different types of errors
  if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    const errors = {};

    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }

    return res.status(statusCode).json({
      error: "Validation Error",
      details: errors,
    });
  }

  if (err.name === "CastError") {
    // Mongoose cast error (usually invalid ObjectId)
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    // Mongoose duplicate key error
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value: ${field}. Please use another value`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Send error response
  return res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
