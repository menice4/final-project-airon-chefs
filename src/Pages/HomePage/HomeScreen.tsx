import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the Quiz Game</h1>
      <p>Choose a mode to get started:</p>

      <div className="button-group">
        <button onClick={() => navigate("/quiz")} className="btn singleplayer">
          🎮 Single Player
        </button>
        <button
          onClick={() => navigate("/quiz-lobby")}
          className="btn multiplayer"
        >
          👥 Multiplayer
        </button>
      </div>
    </div>
  );
}
