// socket IO allows us to set up web sockets
// these connect to the sever, and leaves the connection to the server open
// this allows for real time communication between the server and the client

// load server
const express = require("express");
// load cors
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = `0.0.0.0`;

app.use(cors());
app.use(express.json());

// Test API Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Create HTTP server and intergrate socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Socket.io connection, runs every time a client connects to our server, giving a socket instance for each one
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
