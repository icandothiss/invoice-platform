const express = require("express");
const cors = require("cors");
const colors = require("colors");
require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const morgan = require("morgan");
const PORT = 5000 || 8000;

// Connect to database
connectDB();

const app = express();

app.use(express.json());

app.use(cors());

// Cookie parser
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/invoicings", require("./routes/invoicingRoutes"));
app.use("/api/emails", require("./routes/emailRoutes"));

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`.yellow.bold)
);
