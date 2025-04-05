var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const database = require('./config/db');
const http = require('http');
const hbs = require("hbs");
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken')
require('dotenv').config();

var indexRouter = require('./routes/authroute');
var usersRouter = require('./routes/chatroute');
const Message = require('./models/chat');


var app = express();
const server = http.createServer(app);
const io = socketIo(server);

// View engine setup
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/auth'), path.join(__dirname, 'views/chat')]);
app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);

database();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  ///group chat 
  // socket.on('groupchat', (room) => {
  //   socket.join(room);
  //   console.log(`User ${socket.id} joined room: ${room}`);
  //   socket.to(room).emit("message", `User ${socket.id} has joined the chat`);
  // });

  socket.on("sendMessage", ({ room, message }) => {
    io.to(room).emit("message", message);
  });

  socket.on("private message", async ({ senderId, receiverId, message }) => {
    console.log("Received message:", { senderId, receiverId, message });

    if (!senderId || !receiverId || !message) {
      console.error("Error: Missing required fields");
      return;
    }

    try {
      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();

      io.emit(`private message ${receiverId}`, { senderId, message });
      console.log(`Message sent to ${receiverId}`);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

app.use((req, res, next) => {
  next(createError(404));
});

hbs.registerHelper("eq", function (a, b) {
  return a === b;
});

module.exports = app;
