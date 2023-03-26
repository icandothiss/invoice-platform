const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// @desc Register a new user
//  POST /api/users
//  @access Public
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

  // Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD,
    },
  });
  try {
    // create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    const confirmToken = user.generateConfirmEmailToken();

    user.resetPasswordToken = confirmToken;

    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Email Confirmation Request",
      html: `Please click this link to confirm your email: ${req.protocol}://localhost:${process.env.REACT_APP_URL}/confirm-email?token=${user.confirmEmailToken}`,
    });

    sendTokenResponse(user, 200, res);
  } catch (e) {
    return next(new ErrorResponse("Email could not be sent", 500));
  }
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

// @desc Get a user
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = req.user;

  res.status(200).json(user);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
const resetPassword = asyncHandler(async (req, res, next) => {
  resetToken = req.query.token;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc Forgot Password
// @route POST /api/users/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return next(new ErrorResponse("Please provide an email address", 400));
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorResponse("No user found with that email address", 404)
    );
  }

  // Generate reset token
  const resetToken = user.generateResetPasswordToken();

  await user.save();

  // Create reset URL
  const resetUrl = `${req.protocol}://localhost:${process.env.REACT_APP_URL}/reset-password?token=${resetToken}`;

  // Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD,
    },
  });
  try {
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`,
    });

    res.status(200).json({
      data: user,
      success: true,
      message: "Reset email sent",
    });
  } catch (e) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ ValidateBeforeSave: false });

    return next(new ErrorResponse("Email could not be saved", 500));
  }
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

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isEmailVerified: user.isEmailVerified,
    confirmEmailToken: user.confirmEmailToken,
  });
};

// @desc Confirm email
// @route GET /api/auth/confirm-email
// @access Private
const confirmEmail = asyncHandler(async (req, res, next) => {
  const confirmEmailToken = req.body.token;

  const user = await User.findOne({ confirmEmailToken });

  if (!user) {
    return next(new ErrorResponse("wrong token", 400));
  }

  user.isEmailVerified = true;

  await user.save();

  console.log(user);

  sendTokenResponse(user, 200, res);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  resetPassword,
  forgotPassword,
  logout,
  confirmEmail,
};
