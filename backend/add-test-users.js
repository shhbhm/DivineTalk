const mongoose = require("mongoose");
const User = require("./Models/User.js");
const bcrypt = require("bcryptjs");
const connectDB = require("./db.js");

// Connect to the database
connectDB();

// Create test users
const createTestUsers = async () => {
  try {
    // First, generate hashed passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash("password123", salt);
    const hashedPassword2 = await bcrypt.hash("password123", salt);
    const hashedPassword3 = await bcrypt.hash("password123", salt);

    // Define test users
    const testUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword1,
        about: "Test user 1",
        profilePic: "https://ui-avatars.com/api/?name=John+Doe&background=random&bold=true",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword2,
        about: "Test user 2",
        profilePic: "https://ui-avatars.com/api/?name=Jane+Smith&background=random&bold=true",
      },
      {
        name: "Alex Johnson",
        email: "alex@example.com",
        password: hashedPassword3,
        about: "Test user 3",
        profilePic: "https://ui-avatars.com/api/?name=Alex+Johnson&background=random&bold=true",
      }
    ];

    // Check if users already exist
    for (const testUser of testUsers) {
      const existingUser = await User.findOne({ email: testUser.email });

      if (existingUser) {
        console.log(`User with email ${testUser.email} already exists, skipping...`);
      } else {
        // Create the user
        const newUser = new User(testUser);
        await newUser.save();
        console.log(`Created test user: ${testUser.name} (${testUser.email})`);
      }
    }

    console.log("Test users creation complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating test users:", error);
    process.exit(1);
  }
};

// Run the function
createTestUsers(); 