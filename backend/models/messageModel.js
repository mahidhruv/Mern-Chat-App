// name of the sender or the id of the user
// content of the message
// reference to the chat to which it belongs to

const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  }
);

// NEW INDEX FOR BETTER QUERY PERFORMANCE
messageModel.index({ chat: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageModel);

module.exports = Message;