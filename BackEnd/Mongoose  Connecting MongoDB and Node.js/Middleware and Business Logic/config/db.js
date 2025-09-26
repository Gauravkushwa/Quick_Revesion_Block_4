
const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  try {
    const uri = mongoUri || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/librarydb";
    await mongoose.connect(uri, {
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
