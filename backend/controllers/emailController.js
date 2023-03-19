const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/userModel");
const Email = require("../models/emailModel");
const asyncHandler = require("../middleware/async");
const nodemailer = require("nodemailer");

// configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASSWORD,
  },
});

// @desc send email
// @route POST /api/emails
// @access private
exports.sendEmail = async (req, res) => {
  try {
    const { receiver, subject, body } = req.body;

    // Get user using the id in the JWT
    const senderUser = await User.findById(req.user.id);

    // find receiver user using their email
    const receiverUser = await User.findOne({ email: receiver });

    // create email document and save to database
    const email = await Email.create({
      receiver: receiverUser._id,
      subject,
      body,
    });

    await transporter.sendMail({
      to: receiverUser.email,
      subject: subject,
      text: body,
    });

    res.status(201).send(email);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error sending email" });
  }
};

// @desc get all emails
// @route GET /api/emails
// @access private
exports.getReceivedEmails = async (req, res) => {
  try {
    const { userId } = req.params;
    const emails = await Email.find({ receiver: userId }).populate("sender");
    res.status(200).send(emails);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error getting emails" });
  }
};

// @desc get all emails sent by a user
// @route GET /api/emails/:id
// @access private
exports.getSentEmails = async (req, res) => {
  try {
    const { userId } = req.params;
    const emails = await Email.find({ sender: userId }).populate("receiver");
    res.status(200).send(emails);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error getting emails" });
  }
};
