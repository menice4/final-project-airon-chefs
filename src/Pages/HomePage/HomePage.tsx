"use client";

// Example of how to use these CSS files with your component
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import "./HomePage.css"; // Import the HomePage CSS
import { QuizmaniaLogo } from "../../Components/Logo/Logo";

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { signOut } = authContext;

  const handleSignOut = async () => {
    await signOut();
    navigate("/"); // Redirect to login page after sign-out
  };

  return (
    <div className="page-wrapper">
      <div className="home-container">
        <h1>
          <QuizmaniaLogo />
        </h1>
        <p>Choose a mode to get started:</p>

        <div className="button-group">
          <button
            onClick={() => navigate("/quiz")}
            className="btn singleplayer"
          >
            🎮 Single Player
          </button>
          <button
            onClick={() => navigate("/quiz-lobby")}
            className="btn multiplayer"
          >
            👥 Multiplayer
          </button>
        </div>

        <button onClick={handleSignOut} className="btn signout">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default HomePage;
