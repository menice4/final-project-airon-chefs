// socket IO allows us to set up web sockets
// these connect to the sever, and leaves the connection to the server open
// this allows for real time communication between the server and the client

// load server
const express = require("express");
// load cors
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5002;
const HOST = `0.0.0.0`;

app.use(
  cors({
    origin: [
      "https://final-project-quiz-mania.vercel.app",
      /* "http://localhost:5173", */
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

// TRACK USER SCORES GLOBALLY AND SEND UPDATES
const userScores = {};

// Create HTTP server and intergrate socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      /* "http://localhost:5173", */
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
  users[socket.id] = { id: socket.id, name: "", score: 0 };

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
        "https://opentdb.com/api.php?amount=3&category=9&difficulty=easy&type=multiple"
      );
      const data = await response.json();

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

  // Add this handler for answer submissions
  socket.on("submit-answer", (data) => {
    const { isCorrect, questionIndex } = data;

    // Make sure the user exists
    if (users[socket.id]) {
      // Increment score if answer is correct
      if (isCorrect) {
        // Initialize score if it doesn't exist
        if (users[socket.id].score === undefined) {
          users[socket.id].score = 0;
        }
        users[socket.id].score += 1;
      }

      // Create and broadcast scoreboard
      broadcastScoreboard();
    }
  });

  // Listen for requests for final scores
  socket.on("request-final-scores", () => {
    console.log("Final scores requested by:", socket.id);
    broadcastScoreboard();
  });

  // handler for resetting scores
  socket.on("reset-scores", () => {
    console.log("resetting scores for all users");

    // reset all user scores to 0
    Object.keys(users).forEach((userId) => {
      if (users[userId]) {
        users[userId].score = 0;
      }
    });

    // broadcast updated scoreboard
    broadcastScoreboard();
  });

  // Helper function to broadcast updated scoreboard to all clients
  function broadcastScoreboard() {
    // create array of users with scores, sorted by score (highest first)

    const scoreboard = Object.values(users)
      .map((user) => ({
        id: user.id,
        name: user.name || `Player ${user.id.substring(0, 4)}`,
        score: user.score || 0,
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score);

    // add rank property
    scoreboard.forEach((user, index) => {
      user.rank = index + 1;
    });

    // debugging
    console.log("Broadcasting scoreboard:", scoreboard);

    // finally broadcast scoreboard to all clients
    io.emit("scoreboard-update", scoreboard);
  }

  // Shuffle the answers for the questions
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // HANDLE USERS DISCONNECTING
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // remove the user
    delete users[socket.id];
    // also remove user scores
    delete userScores[socket.id];
    // send updated user list to all clients
    io.emit("update-users", Object.values(users));
    // and update the scoreboard upon disconnect too
    broadcastScoreboard();
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
