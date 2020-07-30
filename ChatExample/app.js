var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressErrorHandler = require("express-error-handler");
var session = require("express-session");
var mongoose = require("mongoose");
var socketio = require("socket.io");
var cors = require("cors");
var passport = require("passport");
var flash = require("connect-flash");

var config = require("./config");
var database = require("./database");
var router = require("./route")(express.Router());
var passportConfig = require("./passport");

var app = express();
var server = require("http").Server(app);
var io = socketio.listen(server);

io.sockets.on("connection", function(socket) {
  console.log("[ ] Connection info : ", socket.request.connection._peername);
  socket.remoteAddress = socket.request.connection._peername.address;
  socket.remotePort = socket.request.connection._peername.port;

  socket.on("message", function(message) {
    console.log("[ ] Received message event.");
    console.dir(message);
    if (message.recepient == "ALL") {
      console.log("[ ] Message Broadcasted");
      io.sockets.emit("message", message);
    }
  });

  socket.on("disconnect", function() {
    console.log(
      "[ ] Disconnected connection : " +
        socket.remoteAddress +
        ":" +
        socket.remotePort
    );
  });
});

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: "SECRET",
    resave: true,
    saveUninitialized: false
  })
);
app.use(express.static("public"));
app.use(flash());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);
app.use(expressErrorHandler.httpError(404));
app.use(
  expressErrorHandler({
    static: {
      "404": "./public/404.html"
    }
  })
);

passportConfig(app, passport);

server.listen(3000, function() {
  console.log("[+] (app) Server started at port " + config.PORT);
  database.init(app, config);
});
