const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
  markMessageAsRead,
} = require("../controllers/messageControllers");

const router = express.Router();

// route for sending the message -> /api/message
router.route("/").post(protect, sendMessage);

// route for fetching the message -> /api/message/:chatId
router.route("/:chatId").get(protect, allMessages);

// route for mark the message as read
router.put("/message/:messageId/read", protect, markMessageAsRead);

module.exports = router;
