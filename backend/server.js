const express = require("express");
const colors = require("colors");
require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;

// Connect to database
connectDB();

const app = express();

// Dev loggin middleware
// Serve Frontend
if (process.env.NODE_ENV === "production") {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // FIX: below code fixes app crashing on refresh in deployment
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
} else {
  app.get("/", (_, res) => {
    res.status(200).json({ message: "Welcome to the Invoice Platform" });
  });
}

app.use(express.json());

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
