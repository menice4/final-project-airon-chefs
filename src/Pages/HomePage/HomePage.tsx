import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const HomePage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { signOut } = authContext;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="home-page">
      <h2>Welcome to the Quiz App!</h2>
      <p>Ready to test your knowledge? Head to the quiz lobby!</p>
      <button onClick={handleSignOut} className="signout-btn">
        Sign Out
      </button>
      <h1>Home Page</h1>
      <Link to="/quiz-lobby">Enter Quiz Lobby</Link>
    </div>
  );
};

export default HomePage;
