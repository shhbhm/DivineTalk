/**
 * User Routes Module
 * Handles all routes related to user operations
 * 
 * @author Shubham Solanki
 * @version 1.1.0
 */

const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser.js");
const {
  getPresignedUrl,
  getOnlineStatus,
  getUserProfile,
  searchUsers
} = require("../Controllers/userController.js");
const {
  getNonFriendsList,
  updateprofile,
  getAllUsers,
} = require("../Controllers/auth_controller.js");

/**
 * @route   GET /api/user/online-status/:id
 * @desc    Get a user's online status and last seen timestamp
 * @access  Private
 */
router.get("/online-status/:id", fetchuser, getOnlineStatus);

/**
 * @route   GET /api/user/non-friends
 * @desc    Get list of users who are not in any conversation with the current user
 * @access  Private
 */
router.get("/non-friends", fetchuser, getNonFriendsList);

/**
 * @route   GET /api/user/all-users
 * @desc    Get all users except the current user and bot users
 * @access  Private
 */
router.get("/all-users", fetchuser, getAllUsers);

/**
 * @route   POST /api/user/update
 * @desc    Update user profile information including password if provided
 * @access  Private
 */
router.post("/update", fetchuser, updateprofile);

/**
 * @route   GET /api/user/presigned-url
 * @desc    Get a presigned URL for S3 file upload
 * @access  Private
 */
router.get("/presigned-url", fetchuser, getPresignedUrl);

/**
 * @route   GET /api/user/profile
 * @desc    Get the current user's complete profile
 * @access  Private
 */
router.get("/profile", fetchuser, getUserProfile);

/**
 * @route   GET /api/user/search
 * @desc    Search for users by name or email
 * @access  Private
 */
router.get("/search", fetchuser, searchUsers);

module.exports = router;
