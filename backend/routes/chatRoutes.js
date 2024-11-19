const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, deleteChat, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatControllers');

const router = express.Router();

// for accessing the chat or creating the chat -> /api/chat
// if user is not logged in then cannot access this route
// get is for getting all the chats for the particular user -> /api/chat
router.route("/").post(protect, accessChat).get(protect, fetchChats);

// for deleting the chat -> api/chat/delete
router.route("/delete").delete(protect, deleteChat);

// for creating the group chat -> /api/chat/group
router.route("/group").post(protect, createGroupChat);

// for renaming the group -> /api/chat/rename
router.route("/rename").put(protect, renameGroup);

// for add someone to the group or join the group -> /api/chat/groupadd
router.route("/groupadd").put(protect, addToGroup);

// for remove someone from the group or leave the group -> /api/chat/groupremove
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;