const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;

// Connect to database
connectDB();

const app = express();

// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

// Cookie parser
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/invoicings", require("./routes/invoicingRoutes"));

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`.yellow.bold)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}.red`);
  process.exit(1);
});
