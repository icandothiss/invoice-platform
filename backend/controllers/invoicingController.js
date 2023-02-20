const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/userModel");
const Invoice = require("../models/invoicingModel");
const asyncHandler = require("../middleware/async");

// @desc Get all invoicings
// @route GET /api/invoicings
// @access private
exports.getInvoicing = asyncHandler(async (req, res, next) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(
      new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404)
    );
  }

  if (invoice.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  res.status(200).json(invoice);
});

// @desc Get signle invoicings
// @route GET /api/invoicings/:id
// @access private
exports.getInvoicings = asyncHandler(async (req, res, next) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Add user property to reqQuery
  reqQuery.user = req.user.id;

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Invoice.find(JSON.parse(queryStr));

  // Select fields

  const invoices = await query;

  res
    .status(200)
    .json({ success: true, count: invoices.length, data: invoices });
});

// @desc create new invoicing
// @route POST /api/invoicings
// @access private
exports.createInvoicing = asyncHandler(async (req, res, next) => {
  const {
    clientName,
    clientEmail,
    clientAddress,
    taxes,
    paymentDueDate,
    items,
  } = req.body;

  if (
    (!clientName || !clientEmail,
    !clientAddress || !taxes || !paymentDueDate || !items)
  ) {
    return next(new ErrorResponse(`Please provide all required fields`, 400));
  }

  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  const invoice = await Invoice.create({
    clientEmail,
    clientName,
    clientAddress,
    taxes,
    paymentDueDate,
    items,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: invoice,
  });
});

// @desc update new invoicing
// @route PUT /api/invoicings/:id
// @access private
exports.updateInvoicing = asyncHandler(async (req, res, next) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(
      new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404)
    );
  }

  if (invoice.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  invoice.set(req.body);
  await invoice.save();
  res.status(200).json({ success: true, data: invoice });
});

// @desc delete invoicing
// @route DELETE /api/invoicings/:id
// @access private
exports.deleteInvoicing = asyncHandler(async (req, res, next) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(
      new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404)
    );
  }

  if (invoice.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  await invoice.remove();
  res.status(200).json({
    success: true,
    msg: `Invoice with id ${req.params.id} has been deleted.`,
  });
});
