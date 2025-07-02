const Conversation = require("../Models/Conversation.js");

const createConversation = async (req, res) => {
  try {
    const { members: memberIds, isGroup = false, name } = req.body;

    if (!memberIds) {
      return res.status(400).json({
        error: "Please fill all the fields",
      });
    }

    // Group chat validation
    if (isGroup && (!name || name.trim() === "")) {
      return res.status(400).json({
        error: "Group name is required",
      });
    }

    // For regular one-to-one chats, check if conversation already exists
    if (!isGroup) {
      const conv = await Conversation.findOne({
        members: { $all: memberIds },
        isGroup: false,
      }).populate("members", "-password");

      if (conv) {
        conv.members = conv.members.filter(
          (memberId) => memberId !== req.user.id
        );
        return res.status(200).json(conv);
      }
    }

    // Create new conversation (either one-to-one or group)
    const newConversation = await Conversation.create({
      members: memberIds,
      isGroup,
      name: isGroup ? name : undefined,
      unreadCounts: memberIds.map((memberId) => ({
        userId: memberId,
        count: 0,
      })),
    });

    await newConversation.populate("members", "-password");

    // For non-group chats, filter out the current user from members in the response
    if (!isGroup) {
      newConversation.members = newConversation.members.filter(
        (member) => member.id !== req.user.id
      );
    }

    return res.status(200).json(newConversation);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate(
      "members",
      "-password",
      "-phoneNum"
    );

    if (!conversation) {
      return res.status(404).json({
        error: "No conversation found",
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getConversationList = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversationList = await Conversation.find({
      members: { $in: userId },
    }).populate("members", "-password");

    if (!conversationList) {
      return res.status(404).json({
        error: "No conversation found",
      });
    }

    // For non-group chats, remove user from members and also other chatbots
    for (let i = 0; i < conversationList.length; i++) {
      if (!conversationList[i].isGroup) {
        conversationList[i].members = conversationList[i].members.filter(
          (member) => member.id !== userId
        );
      }
    }

    conversationList.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    res.status(200).json(conversationList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createConversation,
  getConversation,
  getConversationList,
};
