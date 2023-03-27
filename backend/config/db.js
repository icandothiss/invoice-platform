const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://oussama123:oussama123@cluster0.nvcebn1.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (e) {
    console.log(`Error: ${e.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
