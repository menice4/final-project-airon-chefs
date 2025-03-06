import { useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext";
import "./ScoreBoard.css";

// define player type
interface Player {
  id: string;
  name: string;
  score: number;
  rank: number;
}

export default function Scoreboard() {
  const [scores, setScores] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const socket = useSocket();

  useEffect(() => {
    // get current user ID if socket is connected
    if (socket && socket.id) {
      setCurrentUserId(socket.id);
    } else {
      setCurrentUserId("");
    }

    // listen for scoreboard updates
    socket?.on("scoreboard-update", (scoreboard) => {
      setScores(scoreboard);
    });

    // Cleanup listener when component unmounts
    return () => {
      socket?.off("scoreboard-update");
    };
  }, [socket]);

  return (
    <div className="scoreboard-container">
      <h3>Leaderboard</h3>
      <div className="scoreboard-header">
        <span className="rank">Rank</span>
        <span className="player">Player</span>
        <span className="score">Score</span>
      </div>
      <div className="scoreboard-body">
        {scores.length === 0 ? (
          <div className="no-scores">No players yet</div>
        ) : (
          scores.map((player: Player) => (
            <div
              key={player.id}
              className={player.id === currentUserId ? "current-player" : ""}
            >
              <span className="rank">{player.rank}</span>
              <span className="player">{player.name || "Anonymous"} </span>
              <span className="score">{player.score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
