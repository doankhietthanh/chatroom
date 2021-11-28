const express = require("express");
const { createServer } = require("http");
const { Server, Socket } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
let clientList = [];
app.use("/", express.static("client"));

io.on("connection", (socket) => {
  socket.name = socket.handshake.query.name;
  clientList.push(socket);

  io.emit(
    "members",
    clientList.map((item) => item.name)
  );

  socket.on("chat", (message) => {
    socket.broadcast.emit("chat", message);
  });

  socket.on("disconnect", (e) => {
    clientList = clientList.filter((item) => {
      return item.name != socket.name;
    });
    io.emit(
      "members",
      clientList.map((item) => item.name)
    );
  });
});

httpServer.listen(3000);
