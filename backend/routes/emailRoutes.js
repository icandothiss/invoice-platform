const express = require("express");
const {
  getReceivedEmails,
  getSentEmails,
  sendEmail,
} = require("../controllers/emailController");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getSentEmails)
  .get(protect, getReceivedEmails)
  .post(protect, sendEmail);

module.exports = router;
