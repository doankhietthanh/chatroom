const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server, Socket } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

app.use("/", express.static("client"));

io.on("connection", (socket) => {
  socket.on("msg", (d) => {
    socket.broadcast.emit("msg-end", d);
  });
});

httpServer.listen(3000);
