import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import QuizAnswer from "../../Components/Quiz/QuizAnswer/QuizAnswer";

import { useSocket } from "../../Context/SocketContext";

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  shuffledAnswers?: string[];
};

export default function QuizPageMulti() {
  const socket = useSocket();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Ensuring that the socket is connected before fetching data
  useEffect(() => {
    if (!socket) return;

    socket.on("start-game", (questions: Question[]) => {
      console.log("game started with questions: ", questions);
      setQuestions(questions);
      setLoading(false);
    });

    return () => {
      socket.off("start-game");
    };
  }, [socket]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length - 1) {
      const timer = setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questions.length]);

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html; // is this not a security risk?
    return txt.value;
  };

  const handleAnswerClick = (questionIndex: number, answer: string) => {
    if (selectedAnswers[questionIndex] !== undefined) {
      return;
    }
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    if (answer === questions[questionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Welcome to the Quiz</h1>
      <p>Score: {score}</p>
      {currentQuestion && (
        <div>
          <p>
            {currentQuestionIndex + 1}. {decodeHtml(currentQuestion.question)}
          </p>
          <ul>
            {currentQuestion.shuffledAnswers?.map((answer, answerIndex) => (
              <li key={answerIndex}>
                <QuizAnswer
                  answer={decodeHtml(answer)}
                  onClick={(answer) =>
                    handleAnswerClick(currentQuestionIndex, answer)
                  }
                  isSelected={selectedAnswers[currentQuestionIndex] === answer}
                  isCorrect={answer === currentQuestion.correct_answer}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {currentQuestionIndex === questions.length - 1 && (
        <Link to="/end">Finish</Link>
      )}
    </div>
  );
}
