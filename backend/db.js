const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://solankishubhamit:BRc5PdfvHSDWfKNX@cluster0.uv57snu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: "conversa-chatapp",
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
