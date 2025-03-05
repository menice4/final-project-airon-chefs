import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/quiz-lobby">Enter Quiz Lobby</Link>
    </div>
  );
}

export default HomePage;
