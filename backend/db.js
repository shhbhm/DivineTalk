const mongoose = require("mongoose");
const { MONGO_URI } = require("./secrets.js");

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.error("MongoDB URI is not defined. Please set MONGO_URI in your .env file");
      process.exit(1);
    }

    const conn = await mongoose.connect(MONGO_URI, {
      dbName: "divine-talk-chat-app",
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
