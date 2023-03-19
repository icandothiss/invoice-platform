const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (e) {
      res.status(401);
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

module.exports = { protect };
