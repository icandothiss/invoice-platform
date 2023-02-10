const mongoose = require("mongoose");
const uniqid = require("uniqid");

const InvoicingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  clientName: {
    type: String,
    required: [true, "Please add the name of the client"],
    trim: true,
  },
  clientAddress: {
    type: String,
    required: [true, "Please add the address of the client"],
  },
  clientEmail: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email for the client",
    ],
    required: [true, "Please add an email"],
  },
  taxes: {
    type: Number,
    required: [true, "Please add the taxes for the invoice"],
  },
  number: {
    type: String,
    unique: true,
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
    default: "new",
  },
});

// invoice number
InvoicingSchema.pre("save", function (next) {
  this.number = `${uniqid()}-${new Date().toISOString().slice(0, 10)}`;
  next();
});

// invoice total
InvoicingSchema.pre("save", function (next) {
  this.total =
    this.items.reduce((acc, item) => acc + item.quantity * item.price, 0) -
    this.taxes;
  next();
});

module.exports = mongoose.model("Invoicing", InvoicingSchema);
