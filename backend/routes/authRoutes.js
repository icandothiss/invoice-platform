const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  resetPassword,
  forgotPassword,
  logout,
  confirmEmail,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/resetpassword", resetPassword);
router.post("/forgot-password", forgotPassword);
router.get("/logout", protect, logout);
router.put("/confirm-email", confirmEmail);

module.exports = router;
