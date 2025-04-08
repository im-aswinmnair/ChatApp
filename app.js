const createError = require('http-errors');
const  express = require('express');
const  path = require('path');
const  cookieParser = require('cookie-parser');
const  logger = require('morgan');
const database = require('./config/db');
const http = require('http');
const hbs = require("hbs");
const socketIo = require('socket.io');

require('dotenv').config();

const authRouter  = require('./routes/authroute');
const chatRouter = require('./routes/chatroute');


const Message = require('./models/chat');


const app = express();
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

app.use('/', authRouter);
app.use('/', chatRouter);

database();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


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

app.use((err, req, res, next) => {
   
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
