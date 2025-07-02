const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const {
  sendMessage,
  allMessage,
  deletemesage,
  getPresignedUrl,
  uploadImage,
} = require("../Controllers/message_controller.js");
const fetchuser = require("../middleware/fetchUser.js");

router.get("/presigned-url", fetchuser, getPresignedUrl);
router.get("/:id/:userid", fetchuser, allMessage);
router.post("/upload", fetchuser, upload.single("file"), uploadImage);
router.post("/send", fetchuser, sendMessage);
router.delete("/delete/:messageId", fetchuser, deletemesage);

module.exports = router;
