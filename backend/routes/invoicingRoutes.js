const express = require("express");
const {
  getInvoicing,
  getInvoicings,
  createInvoicing,
  updateInvoicing,
  deleteInvoicing,
  payInvoicing,
} = require("../controllers/invoicingController");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getInvoicings).post(protect, createInvoicing);

router
  .route("/:id")
  .get(protect, getInvoicing)
  .put(protect, updateInvoicing)
  .delete(protect, deleteInvoicing);

router.route("/:id/pay").put(payInvoicing);

module.exports = router;
