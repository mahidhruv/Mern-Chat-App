const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

// for creating or fetching one on one chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400);
  }

  //finding the id of both the users
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    // storing chat in the database
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.find({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// for fetching the chats of the particular user
// const fetchChats = asyncHandler(async (req, res) => {
//   try {
//     Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
//       .populate("users", "-password")
//       .populate("groupAdmin", "-password")
//       .populate("latestMessage")
//       .sort({ updatedAt: -1 })
//       .then(async (results) => {
//         results = await User.populate(results, {
//           path: "latestMessage.sender",
//           select: "name pic email",
//         });
//         res.status(200).send(results);
//       });
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// fetching the chats for the users with single sided delete functionality
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // USING ASYNC/AWAIT SYNTAX FOR BETTER READABILITY
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
      // FILTER OUT DELETED CHATS
      deletedFor: {
        $not: {
          $elemMatch: { user: req.user._id },
        },
      },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    // Populate sender information for latest message
    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// fetching the chats for the users with single sided delete functionality support chat restoration
// const fetchChats = asyncHandler(async (req, res) => {
//   try {
//     // MODIFIED: Updated query to include both non-deleted and restored chats
//     let results = await Chat.find({
//       users: { $elemMatch: { $eq: req.user._id } },
//       $or: [
//         // Case 1: Chat is not deleted for this user
//         {
//           deletedFor: {
//             $not: {
//               $elemMatch: { user: req.user._id },
//             },
//           },
//         },
//         // Case 2: Chat was deleted but has new messages
//         {
//           deletedFor: {
//             $elemMatch: {
//               user: req.user._id,
//               // Check if there's a latest message after deletion
//               $expr: {
//                 $lt: ["$deletedAt", "$latestMessage.createdAt"],
//               },
//             },
//           },
//         },
//       ],
//     })
//       .populate("users", "-password")
//       .populate("groupAdmin", "-password")
//       .populate("latestMessage")
//       .sort({ updatedAt: -1 });

//     // Populate sender information for latest message
//     results = await User.populate(results, {
//       path: "latestMessage.sender",
//       select: "name pic email",
//     });

//     // NEW: Process results to mark restored chats
//     results = results.map((chat) => {
//       const chatObj = chat.toObject();
//       const userDeletion = chat.deletedFor?.find(
//         (del) => del.user.toString() === req.user._id.toString()
//       );

//       if (
//         userDeletion &&
//         chat.latestMessage &&
//         chat.latestMessage.createdAt > userDeletion.deletedAt
//       ) {
//         // Mark chat as restored and include deletion timestamp
//         chatObj.isRestored = true;
//         chatObj.deletedAt = userDeletion.deletedAt;

//         // Add indicator for restored chats
//         if (chat.isGroupChat) {
//           chatObj.chatName = `${chat.chatName} (New Messages)`;
//         } else {
//           // For one-on-one chats, find the other user's name
//           const otherUser = chat.users.find(
//             (u) => u._id.toString() !== req.user._id.toString()
//           );
//           chatObj.chatName = `${otherUser.name} (New Messages)`;
//         }
//       }

//       return chatObj;
//     });

//     res.status(200).send(results);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });


// for deleting the chat of a particular user
// const deleteChat = asyncHandler(async (req, res) => {
//   const { chatId } = req.body;

//   // Find the chat first
//   const chat = await Chat.findById(chatId);

//   if (!chat) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   }

//   // Check if user is part of the chat
//   if (!chat.users.includes(req.user._id)) {
//     res.status(403);
//     throw new Error("Not authorized to delete this chat");
//   }

//   // Delete associated messages first
//   await Message.deleteMany({ chat: chatId });

//   // Delete the chat
//   const deletedChat = await Chat.findByIdAndDelete(chatId);

//   res.json(deletedChat);
// });

// for deleting the chat of a particular user (one-sided deletion)
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const userId = req.user._id;

  // Find the chat first
  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat Not Found");
  }

  // Check if user is part of the chat
  if (!chat.users.includes(userId)) {
    res.status(403);
    throw new Error("Not authorized to delete this chat");
  }

  // Check if user has already deleted this chat
  const alreadyDeleted = chat.deletedFor.some(
    (deletion) => deletion.user.toString() === userId.toString()
  );

  if (alreadyDeleted) {
    res.status(400);
    throw new Error("Chat already deleted");
  }

  // Add user to deletedFor array instead of actually deleting the chat
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        deletedFor: {
          user: userId,
          deletedAt: new Date(),
        },
      },
    },
    { new: true }
  );

  // If all users have deleted the chat, then we can actually delete it
  // and its associated messages
  const allUsersDeleted = updatedChat.users.every((user) =>
    updatedChat.deletedFor.some(
      (deletion) => deletion.user.toString() === user.toString()
    )
  );

  if (allUsersDeleted) {
    // Delete associated messages first
    await Message.deleteMany({ chat: chatId });
    // Delete the chat
    await Chat.findByIdAndDelete(chatId);
    
    res.json({ message: "Chat permanently deleted" });
  } else {
    res.json({ message: "Chat deleted for you" });
  }
});


// for creating group chats
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// for renaming the group
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// for adding user to the group
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

// for removing user from the group
// const removeFromGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId } = req.body;

//   const removed = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $pull: { users: userId },
//     },
//     { new: true }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!removed) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   } else {
//     res.json(removed);
//   }
// });

// For removing the user from the group
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Check if the chat exists and is a group
  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat Not Found");
  }

  // Optional: Check if the requesting user has permission to remove users
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only admin can remove users");
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(removed);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteChat,
};
