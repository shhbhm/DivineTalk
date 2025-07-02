const Message = require("../Models/Message.js");
const Conversation = require("../Models/Conversation.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const imageupload = require("../config/imageupload.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const {
  AWS_BUCKET_NAME,
  AWS_SECRET,
  AWS_ACCESS_KEY,
  GENERATIVE_API_KEY,
} = require("../secrets.js");
const { S3Client } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

// Use environment variable only - no hardcoded keys for security
const apiKey = GENERATIVE_API_KEY || "";
const configuration = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const modelId = "gemini-1.5-flash";
const model = configuration ? configuration.getGenerativeModel({ model: modelId }) : null;

// Check if API key is properly configured
const isApiKeyConfigured = apiKey && apiKey.length > 0;

const sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, text, imageUrl } = req.body;
    if (!conversationId || !sender) {
      return res.status(400).json({
        error: "Conversation ID and sender are required",
      });
    }

    // Allow empty text if there's an image
    if (!text && !imageUrl) {
      return res.status(400).json({
        error: "Message must contain either text or an image",
      });
    }

    const conversation = await Conversation.findById(conversationId).populate(
      "members",
      "-password"
    );

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found",
      });
    }

    //check if conversation contains bot
    var isbot = false;

    conversation.members.forEach((member) => {
      if (member._id != sender && member.email?.includes("bot")) {
        isbot = true;
      }
    });

    if (!isbot) {
      const newMessage = new Message({
        conversationId,
        sender,
        text: text || "",
        imageUrl: imageUrl || "",
        seenBy: [sender],
      });

      await newMessage.save();
      console.log("newMessage saved");

      conversation.updatedAt = new Date();
      await conversation.save();

      res.json(newMessage);
    } else {
      res.status(200).json({ message: "Bot message handled separately" });
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const allMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
      deletedFrom: { $ne: req.user.id },
    });

    messages.forEach(async (message) => {
      let isUserAddedToSeenBy = false;
      message.seenBy.forEach((element) => {
        if (element.user == req.user.id) {
          isUserAddedToSeenBy = true;
        }
      });
      if (!isUserAddedToSeenBy) {
        message.seenBy.push({ user: req.user.id });
      }
      await message.save();
    });

    res.json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const deletemesage = async (req, res) => {
  const msgid = req.body.messageid;
  const userids = req.body.userids;
  try {
    const message = await Message.findById(msgid);

    userids.forEach(async (userid) => {
      if (!message.deletedby.includes(userid)) {
        message.deletedby.push(userid);
      }
    });
    await message.save();
    res.status(200).send("Message deleted successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getPresignedUrl = async (req, res) => {
  const filename = req.query.filename;
  const filetype = req.query.filetype;

  if (!filename || !filetype) {
    return res
      .status(400)
      .json({ error: "Filename and filetype are required" });
  }

  const validFileTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
  ];

  if (!validFileTypes.includes(filetype)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  const userId = req.user.id;
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET,
    },
    region: "ap-south-1",
  });

  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: AWS_BUCKET_NAME,
      Key: `conversa/${userId}/${Math.random()}/${filename}`,
      Conditions: [["content-length-range", 0, 5 * 1024 * 1024]],
      Fields: {
        success_action_status: "201",
      },
      Expires: 15 * 60,
    });

    return res.status(200).json({ url, fields });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAiResponse = async (prompt, senderId, conversationId) => {
  var currentMessages = [];
  const conv = await Conversation.findById(conversationId);
  const botId = conv.members.find((member) => member != senderId);

  // If API key is not configured, return a fallback message
  if (!isApiKeyConfigured) {
    const botMessage = await Message.create({
      conversationId: conversationId,
      senderId: botId,
      text: "I'm sorry, the AI chatbot is not properly configured. Please contact the administrator to set up the Google Generative AI API key.",
    });
    
    conv.latestmessage = botMessage.text;
    await conv.save();
    
    return botMessage;
  }

  const messagelist = await Message.find({
    conversationId: conversationId,
  })
    .sort({ createdAt: -1 })
    .limit(20);

  messagelist.forEach((message) => {
    if (message.senderId == senderId) {
      currentMessages.push({
        role: "user",
        parts: message.text,
      });
    } else {
      currentMessages.push({
        role: "model",
        parts: message.text,
      });
    }
  });

  // reverse currentMessages
  currentMessages = currentMessages.reverse();

  try {
    const chat = model.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    var responseText = response.text();

    if (responseText.length < 1) {
      responseText = "Woops!! thats soo long ask me something in short.";
      return -1;
    }

    await Message.create({
      conversationId: conversationId,
      senderId: senderId,
      text: prompt,
      seenBy: [{ user: botId, seenAt: new Date() }],
    });

    const botMessage = await Message.create({
      conversationId: conversationId,
      senderId: botId,
      text: responseText,
    });

    conv.latestmessage = responseText;
    await conv.save();

    return botMessage;
  } catch (error) {
    console.log(error.message);
    // More descriptive error message
    const errorMessage = "Sorry, I encountered an error while generating a response. " + 
                         (error.message ? "Error: " + error.message : "Please try again later.");
    
    const botMessage = await Message.create({
      conversationId: conversationId,
      senderId: botId,
      text: errorMessage,
    });
    
    conv.latestmessage = errorMessage;
    await conv.save();
    
    return botMessage;
  }
};

const sendMessageHandler = async (data) => {
  const {
    text,
    imageUrl,
    senderId,
    conversationId,
    receiverId,
    isReceiverInsideChatRoom,
  } = data;
  const conversation = await Conversation.findById(conversationId);
  
  // If it's a group chat
  if (conversation.isGroup) {
    // Create the message
    const message = await Message.create({
      conversationId,
      senderId,
      text,
      imageUrl,
      seenBy: [], // Initially empty, will be updated as members see the message
    });

    // Update conversation latest message and increment unread count for all members except sender
    conversation.latestmessage = text;
    conversation.unreadCounts = conversation.unreadCounts.map((unread) => {
      if (unread.userId.toString() !== senderId) {
        unread.count += 1;
      }
      return unread;
    });
    
    await conversation.save();
    return message;
  }
  
  // Regular one-to-one chat
  if (!isReceiverInsideChatRoom) {
    const message = await Message.create({
      conversationId,
      senderId,
      text,
      imageUrl,
      seenBy: [],
    });

    // update conversation latest message and increment unread count of receiver by 1
    conversation.latestmessage = text;
    conversation.unreadCounts.map((unread) => {
      if (unread.userId.toString() == receiverId.toString()) {
        unread.count += 1;
      }
      return unread;
    });
    await conversation.save();
    return message;
  } else {
    // create new message with seenby receiver
    const message = await Message.create({
      conversationId,
      senderId,
      text,
      imageUrl,
      seenBy: [
        {
          user: receiverId,
          seenAt: new Date(),
        },
      ],
    });
    conversation.latestmessage = text;
    await conversation.save();
    return message;
  }
};

const deleteMessageHandler = async (data) => {
  const { messageId, deleteFrom } = data;
  const message = await Message.findById(messageId);

  if (!message) {
    return false;
  }

  try {
    deleteFrom.forEach(async (userId) => {
      if (!message.deletedFrom.includes(userId)) {
        message.deletedFrom.push(userId);
      }
    });
    await message.save();

    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: "Only image files are allowed" });
    }

    console.log('Uploading file:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const imageUrl = await imageupload(req.file, false);
    
    if (!imageUrl) {
      console.error('Image upload failed - no URL returned');
      return res.status(500).json({ error: "Failed to upload image to cloud storage" });
    }

    console.log('Image uploaded successfully:', imageUrl);
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error in uploadImage:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

module.exports = {
  sendMessage,
  allMessage,
  deletemesage,
  getPresignedUrl,
  getAiResponse,
  sendMessageHandler,
  deleteMessageHandler,
  uploadImage,
};
