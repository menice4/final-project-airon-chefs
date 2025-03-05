import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuizLobbyPage from "./Pages/QuizLobbyPage/QuizLobbyPage";
import QuizPage from "./Pages/QuizPage/QuizPage";
import EndPage from "./Pages/EndPage/EndPage";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/quiz-lobby" element={<QuizLobbyPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/end" element={<EndPage />} />
      </Routes>
    </Router>
  );
}
export default App;
