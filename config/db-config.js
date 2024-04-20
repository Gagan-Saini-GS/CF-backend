const mongoose = require("mongoose");

const DB_URL = process.env.DBURL;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// mongoose.connect("mongodb://localhost:27017/ClosetFashionDB");

module.exports = { connectDB };
