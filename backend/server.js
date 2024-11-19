const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// const cors = require("cors");
// const mongoose = require("mongoose");
// const User = require("./models/User");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const { body, validationResult } = require("express-validator");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

// app.get("/api/chats", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "Chats retrieved successfully",
//     data: chats,
//   });
// });

// app.get("/api/chat/:id", (req, res) => {
//   // console.log(req);
//   const singleChat = chats.find((chat) => chat._id === req.params.id);
//   if (singleChat) {
//     res.status(200).json({
//       status: "success",
//       message: "Chat retrieved successfully",
//       data: singleChat,
//     });
//   } else {
//     res.status(404).json({
//       status: "error",
//       message: "Chat not found. Please check the provided ID.",
//     });
//   }
// });

const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
