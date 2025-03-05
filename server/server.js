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

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Test API Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// TRACKS USERS GLOBALLY AND SEND UPDATES
const users = {};

// Create HTTP server and intergrate socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection, runs every time a client connects to our server, giving a socket instance for each one
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Add a new user to the users object when connected
  users[socket.id] = { id: socket.id };

  // Send updated user list to all clients
  io.emit("update-users", Object.values(users));

  // Listen for a message from the client
  socket.on("message", (data) => {
    console.log("Message received on server:", data);
    // Send the message to all clients
    socket.broadcast.emit("receive-message", data);
  });

  // Listens for users joining a room
  socket.on("join-room", (room) => {
    socket.join(room);
    if (!users[room]) {
      users[room] = [];
    }
    users[room].push({ id: socket.id });
    io.to(room).emit("update-users", users[room]);
  });

  // HANDLE USERS DISCONNECTING
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // remove the user
    delete users[socket.id];
    // send updated user list to all clients
    io.emit("update-users", Object.values(users));
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
