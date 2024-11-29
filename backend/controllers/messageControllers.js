const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// controller to send the message
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// controller to get the message corresponding to chat id
// const allMessages = asyncHandler(async (req, res) => {
//   try {
//     const messages = await Message.find({ chat: req.params.chatId })
//       .populate("sender", "name pic email")
//       .populate("chat");
//     res.json(messages);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// controller to get the message corresponding to chat id (restore functionality)
const allMessages = asyncHandler(async (req, res) => {
  try {
    // NEW: First check if chat exists and if user has access
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      res.status(404);
      throw new Error("Chat Not Found");
    }

    // NEW: Check if user is part of the chat
    if (!chat.users.includes(req.user._id)) {
      res.status(403);
      throw new Error("Not authorized to access these messages");
    }

    // NEW: Find if user previously deleted this chat
    // const userDeletion = chat.deletedFor?.find(
    //   (del) => del.user.toString() === req.user._id.toString()
    // );

    // MODIFIED: Add deletion timestamp filter if applicable
    const messages = await Message.find({
      chat: req.params.chatId,
      // Only fetch messages created after user's deletion timestamp
      // ...(userDeletion && {
      //   createdAt: { $gt: userDeletion.deletedAt },
      // }),
    })
      .populate("sender", "name pic email")
      .populate("chat")
      // NEW: Add sorting to ensure consistent message order
      .sort({ createdAt: 1 }); // Show oldest messages first

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// NEW: Add a message read status update function (optional) -> this functionality is not implemented yet
const markMessageAsRead = asyncHandler(async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Add user to readBy if not already present
    if (!message.readBy.includes(req.user._id)) {
      message.readBy.push(req.user._id);
      await message.save();
    }

    res.json({ message: "Message marked as read" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


module.exports = { sendMessage, allMessages, markMessageAsRead };
