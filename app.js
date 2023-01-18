var createError = require("http-errors");
var express = require("express");
var path = require("path");
//var http = require('http')
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
//var {Server} = require('socket.io');
var chatRouter = require("./routes/chat");
var usersRouter = require("./routes/users");
var messageRouter = require("./routes/message")
var mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.set("strictQuery", false);


var app = express();
//var server = require('http').Server(app);
//var server = http.createServer(app)
//var io = require('socket.io')(server);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/unifance_assignment", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/chats", chatRouter);
app.use("/users", usersRouter);
app.use("/messages", messageRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
// const PORT = 3000;
// const server = express()
//   .use(app)
//   .listen(PORT, () => console.log(`Listening Socket on ${ PORT }`));

//socket implementation
// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors : {
//       origin : "http://localhost:3001",
//   }
// })
const  io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3001",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
      console.log("Data: ", data.text)
    }
  });
});



module.exports = app;
