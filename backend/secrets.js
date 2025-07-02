const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

console.log("Environment variables:", process.env.PORT, process.env.MONGO_URI ? "MONGO_URI exists" : "MONGO_URI missing");

const MONGO_URI = process.env.MONGO_URI;
const GENERATIVE_API_KEY = process.env.GENERATIVE_API_KEY;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET = process.env.AWS_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || "";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  MONGO_URI,
  AWS_ACCESS_KEY,
  AWS_SECRET,
  GENERATIVE_API_KEY,
  EMAIL,
  PASSWORD,
  AWS_BUCKET_NAME,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
};
