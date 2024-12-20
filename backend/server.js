const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

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

// app.get("/", (req, res) => {
//   res.send("Api is running");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ---------------------------Deployment--------------------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    console.log(
      "Attempting to serve:",
      path.resolve(__dirname1, "frontend", "build", "index.html")
    );
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}

// ---------------------------Deployment--------------------------------

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

const server = require("http").createServer(app);

// const server = app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://talk-a-tive-adbc.onrender.com" // Your Render domain
        : "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

server.listen(
  //server start
  PORT,
  console.log(`Server running on port ${PORT}`.yellow.bold)
);
