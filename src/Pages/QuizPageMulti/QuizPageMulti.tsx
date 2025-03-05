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

    console.log("QuizPageMulti: Setting up game-starting listener");

    socket.on("quiz-questions", (questionData) => {
      console.log("QuizPageMulti: quiz-questions event received");
      console.log("QuizPageMulti: Received questions:", questionData.length);

      if (questionData && questionData.length > 0) {
        setQuestions(questions);
        setLoading(false);
      } else {
        console.error("no questions received idiot");
        setError(new Error("No questions received"));
      }
    });

    return () => {
      socket.off("quiz-questions");
    };
  }, [socket]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length - 1) {
      const timer = setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    } else {
      // more debugging
      console.error("No questions received");
      setError(new Error("No questions received"));
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
    console.log("still loading");
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
