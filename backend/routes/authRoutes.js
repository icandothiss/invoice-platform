const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  resetPassword,
  forgotPassword,
  logout,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/resetpassword", resetPassword);
router.post("/forgot-password", forgotPassword);
router.get("/logout", protect, logout);

module.exports = router;
