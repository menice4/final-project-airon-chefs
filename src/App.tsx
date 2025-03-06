import "./App.css";

import { Route, Routes } from "react-router-dom";
import Lobby from "./Pages/QuizLobbyPage/Lobby";
import QuizPage from "./Pages/QuizPage/QuizPage";
import EndPage from "./Pages/EndPage/EndPage";

import HomeScreen from "./Pages/HomePage/HomeScreen";

import LoginPage from "./Pages/LoginPage/LoginPage";

// multiplayer import
import QuizPageMulti from "./Pages/QuizPageMulti/QuizPageMulti";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/quiz-lobby" element={<Lobby />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/quiz-multi" element={<QuizPageMulti />} />
      <Route path="/end" element={<EndPage />} />
    </Routes>
  );
}
export default App;
