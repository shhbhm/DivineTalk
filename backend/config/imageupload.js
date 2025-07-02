const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

// Use the values from secrets.js as fallback
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = require("../secrets.js");

if (!process.env.CLOUDINARY_CLOUD_NAME && !CLOUDINARY_CLOUD_NAME) {
  console.error("Cloudinary cloud name is not configured. Please set CLOUDINARY_CLOUD_NAME in your .env file");
  process.exit(1);
}

if (!process.env.CLOUDINARY_API_KEY && !CLOUDINARY_API_KEY) {
  console.error("Cloudinary API key is not configured. Please set CLOUDINARY_API_KEY in your .env file");
  process.exit(1);
}

if (!process.env.CLOUDINARY_API_SECRET && !CLOUDINARY_API_SECRET) {
  console.error("Cloudinary API secret is not configured. Please set CLOUDINARY_API_SECRET in your .env file");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || CLOUDINARY_API_SECRET
});

const imageupload = async (file, usepreset) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("Invalid file provided");
    }

    console.log("Uploading file:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    const options = {
      resource_type: "auto",
      folder: "chat-app",
      use_filename: true,
      unique_filename: true,
      transformation: [
        { quality: "auto:good" }, // Optimize image quality
        { fetch_format: "auto" }  // Auto-select best format
      ]
    };

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error(`Failed to upload image: ${error.message}`));
        } else {
          console.log("Upload successful:", result.secure_url);
          resolve(result);
        }
      });

      // Handle stream errors
      uploadStream.on('error', (error) => {
        console.error("Upload stream error:", error);
        reject(new Error("Failed to process image upload"));
      });

      uploadStream.end(file.buffer);
    });

    if (!result || !result.secure_url) {
      throw new Error("No URL received from Cloudinary");
    }

    return result.secure_url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error; // Propagate the error to be handled by the controller
  }
};

module.exports = imageupload;
