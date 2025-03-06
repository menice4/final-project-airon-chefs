import "./App.css";
import { Route, Routes } from "react-router-dom";
import Lobby from "./Pages/QuizLobbyPage/Lobby";
import QuizPage from "./Pages/QuizPage/QuizPage";
import EndPage from "./Pages/EndPage/EndPage";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import QuizPageMulti from "./Pages/QuizPageMulti/QuizPageMulti";

import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";

function App() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { session } = authContext;

  

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {session && (
        <>
          <Route path="/home" element={<HomePage />} />
          <Route path="/quiz-lobby" element={<Lobby />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz-multi" element={<QuizPageMulti />} />
          <Route path="/end" element={<EndPage />} />
        </>
      )}
    </Routes>
  );
}

export default App;
