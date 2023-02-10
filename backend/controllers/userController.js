const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/userModel");

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, password2, phone } = req.body;

  //Validation
  if (!name || !email || !password || !password2 || !phone) {
    return next(new ErrorResponse(`Please include all fields`, 400));
  }

  if (password !== password2) {
    return next(new ErrorResponse("Password does not match", 400));
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse("User already exists", 400));
  }

  // create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  sendTokenResponse(user, 200, res);
});

// @desc Login a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate Email & Password
  if (!email || !password) {
    return next(new ErrorResponse("Please include all fields", 400));
  }

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  sendTokenResponse(user, 200, res);
});

// @desc Login a user
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(user);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
