const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  console.log(err);
  if (err.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    error = new ErrorResponse(messages, 400);
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode);
  res.json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = { errorHandler };
