"use client";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext";
import "./EndPage.css";

// Define types for our data structures
interface Player {
  id: string;
  name: string;
  score: number;
  rank: number;
}

interface ConfettiPiece {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

function EndPage() {
  const [winner, setWinner] = useState<Player | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [finalScores, setFinalScores] = useState<Player[]>([]);
  const socket = useSocket();

  // Generate confetti pieces
  useEffect(() => {
    const confettiCount = 50;
    const newConfetti: ConfettiPiece[] = [];

    for (let i = 0; i < confettiCount; i++) {
      newConfetti.push({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 5}s`,
      });
    }

    setConfetti(newConfetti);
  }, []);

  // Load the final scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem("finalScoreboard");
    if (savedScores) {
      try {
        const parsedScores = JSON.parse(savedScores);
        console.log("Loaded final scores from localStorage:", parsedScores);
        setFinalScores(parsedScores);
        if (parsedScores.length > 0) {
          setWinner(parsedScores[0]);
        }
      } catch (e) {
        console.error("Error parsing saved scores:", e);
      }
    }
  }, []);

  // Get winner from scoreboard updates and save final scores
  useEffect(() => {
    if (socket) {
      // Listen for scoreboard updates to determine the winner
      const handleScoreboardUpdate = (scoreboard: Player[]) => {
        console.log("Received scoreboard update:", scoreboard);
        if (scoreboard && scoreboard.length > 0) {
          // Save the final scores
          setFinalScores(scoreboard);
          // The winner is the first player (highest score)
          setWinner(scoreboard[0]);
        }
      };

      socket.on("scoreboard-update", handleScoreboardUpdate);

      // Request final scores when component mounts
      socket.emit("request-final-scores");

      return () => {
        socket.off("scoreboard-update", handleScoreboardUpdate);
      };
    }
  }, [socket]);

  // Function to handle returning to home and resetting scores
  const handleReturnHome = () => {
    // Clear the saved scoreboard from localStorage
    localStorage.removeItem("finalScoreboard");
    // Emit a custom event to reset scores
    if (socket) {
      socket.emit("reset-scores");
    }
  };

  return (
    <div className="end-page-container">
      {/* Confetti animation */}
      <div className="confetti-container">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti"
            style={{
              left: piece.left,
              animationDuration: piece.animationDuration,
              animationDelay: piece.animationDelay,
            }}
          ></div>
        ))}
      </div>

      <div className="celebration-header">
        <h1>Quiz Complete!</h1>
        <p>Thank you for playing</p>
      </div>

      <div className="final-scoreboard-section">
        <h2>Final Results</h2>

        {/* Display a custom final scoreboard instead of the live one */}
        <div className="scoreboard-container">
          <div className="scoreboard-header">
            <span className="rank">Rank</span>
            <span className="player">Player</span>
            <span className="score">Score</span>
          </div>
          <div className="scoreboard-body">
            {finalScores.length === 0 ? (
              <div className="no-scores">No players yet</div>
            ) : (
              finalScores.map((player: Player) => (
                <div
                  key={player.id}
                  className={
                    socket && player.id === socket.id ? "current-player" : ""
                  }
                >
                  <span className="rank">{player.rank}</span>
                  <span className="player">{player.name || "Anonymous"} </span>
                  <span className="score">{player.score}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Winner highlight section */}
        {winner && (
          <div className="winner-highlight">
            <div className="winner-crown">👑</div>
            <h3>Congratulations!</h3>
            <p>
              {winner.name || "Anonymous"} wins with {winner.score} points!
            </p>
          </div>
        )}
      </div>

      <Link to="/home" className="home-button" onClick={handleReturnHome}>
        Back to Home
      </Link>
    </div>
  );
}

export default EndPage;
