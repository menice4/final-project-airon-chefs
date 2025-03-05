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
    origin: [
      "https://final-project-quiz-mania.vercel.app",
      "http://localhost:5173",
    ],

    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Test API Route
app.get("/api/questions", async (req, res) => {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// TRACKS USERS GLOBALLY AND SEND UPDATES
const users = {};

// Create HTTP server and intergrate socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://final-project-quiz-mania.vercel.app",
    ],

    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection, runs every time a client connects to our server, giving a socket instance for each one
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Add a new user to the users object when connected
  users[socket.id] = { id: socket.id, name: "" };

  // Send updated user list to all clients
  io.emit("update-users", Object.values(users));

  // Listen for a message from the client
  socket.on("message", (data) => {
    console.log("Message received on server:", data);
    // Send the message to all clients
    socket.broadcast.emit("receive-message", data);
  });

  // listen for users setting their username
  socket.on("rename-user", (newName) => {
    if (users[socket.id]) {
      users[socket.id].name = newName;
      io.emit("update-users", Object.values(users));
    }
  });

  // Listen for the start game event
  // Makes a request to the API for questions
  // Sends the questions to all clients
  socket.on("start-game", async () => {
    console.log("Start game event received");
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );
      const data = await response.json();

      // Add more detailed logging
      console.log("raw api response:", data);

      const questions = data.results.map((question) => ({
        ...question,
        shuffledAnswers: shuffleArray([
          question.correct_answer,
          ...question.incorrect_answers,
        ]),
      }));

      // Log number of questions
      console.log("Number of Questions:", questions.length);

      // send notification to navigate to quiz page
      io.emit("navigate-to-quiz");

      // send questions data in a separate event
      setTimeout(() => {
        io.emit("quiz-questions", questions);
        console.log("emitted quiz-questions event");
      }, 500); // small delay to ensure navigation happens first
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  });

  // Shuffle the answers for the questions
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

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
