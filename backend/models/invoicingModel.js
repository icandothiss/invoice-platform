const mongoose = require("mongoose");
const uniqid = require("uniqid");

const InvoicingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  clientEmail: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  taxes: {
    type: Number,
    required: [true, "Please add the taxes for the invoice"],
  },
  number: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  paymentDueDate: {
    type: Date,
    required: [true, "Please add the payment due date"],
  },
  items: [
    {
      item: {
        type: String,
        required: [true, "Please add the name of the item"],
      },
      quantity: {
        type: Number,
        required: [true, "Please add the quantity of the item"],
      },
      price: {
        type: Number,
        required: [true, "Please add the price of the item"],
      },
    },
  ],
  total: {
    type: Number,
  },
  status: {
    type: String,
    required: true,
    default: "unpaid",
  },
});
// invoice number
InvoicingSchema.pre("save", function (next) {
  const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  this.number = `${uniqid().slice(4)}${dateString}`;
  next();
});

// status to lower case
InvoicingSchema.pre("save", function (next) {
  this.status = this.status.toLowerCase();
  next();
});

// invoice total
InvoicingSchema.pre("save", function (next) {
  this.total = this.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  next();
});

module.exports = mongoose.model("Invoicing", InvoicingSchema);
