import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fetchData from "./fetchData";
import QuizAnswer from "../../Components/Quiz/QuizAnswer/QuizAnswer";
import Clock from "../../Components/Clock/Clock";

// Define our types
export type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  shuffledAnswers?: string[];
  type: string;
  difficulty: string;
  category: string;
};

// Add type for global timeout
declare global {
  interface Window {
    bufferTimeoutId?: number;
  }
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isBufferTime, setIsBufferTime] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  const bufferTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Cleanup function to prevent memory leaks and race conditions
  const clearBufferTimeout = () => {
    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current);
      bufferTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData();
        if (Array.isArray(data) && data.length > 0) {
          const questionsWithShuffledAnswers = data.map((question) => ({
            ...question,
            shuffledAnswers: shuffleArray([
              question.correct_answer,
              ...question.incorrect_answers,
            ]),
          }));
          setQuestions(questionsWithShuffledAnswers);
        } else {
          throw new Error("No questions received from API");
        }
      } catch (error) {
        setError(error as Error);
        console.error("Error in getData:", error);
      } finally {
        setLoading(false);
      }
    }
    getData();

    // Cleanup on component unmount
    return () => {
      clearBufferTimeout();
    };
  }, []);

  // Reset timer and state when changing questions
  useEffect(() => {
    setTimerRunning(true);
    setIsBufferTime(false);
    setTimerKey((prev) => prev + 1);

    return () => {
      clearBufferTimeout();
    };
  }, [currentQuestionIndex]);

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleArray = (array: string[]) => {
    // Create a copy to avoid mutating the original array
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerClick = (questionIndex: number, answer: string) => {
    // Prevent selecting multiple answers or during buffer time
    if (selectedAnswers[questionIndex] !== undefined || isBufferTime) {
      return;
    }

    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));

    if (answer === questions[questionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Pause the timer when an answer is selected
    setTimerRunning(false);

    // Start buffer time after selecting an answer
    setIsBufferTime(true);

    clearBufferTimeout();

    bufferTimeoutRef.current = window.setTimeout(() => {
      moveToNextQuestion();
    }, 3000); // 3 seconds buffer time to show answer feedback
  };

  const handleTimerComplete = () => {
    setTimerRunning(false);
    setIsBufferTime(true);

    clearBufferTimeout();

    bufferTimeoutRef.current = window.setTimeout(() => {
      moveToNextQuestion();
    }, 3000); // 3 seconds buffer time to show correct answer
  };

  const moveToNextQuestion = () => {
    clearBufferTimeout();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      // Timer will be reset by the useEffect that watches currentQuestionIndex
    } else {
      // All questions completed
      navigate("/end", { state: { score, totalQuestions: questions.length } });
    }
  };

  if (loading) {
    return <div className="quiz-loading">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="quiz-error">
        <h2>Error loading quiz</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-error">
        <h2>No questions available</h2>
        <p>Unable to load quiz questions.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h1>Quiz Challenge</h1>
      <div className="quiz-info">
        <p>
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <p>Score: {score}</p>
      </div>

      {currentQuestion && (
        <div className="question-container">
          <Clock
            key={timerKey}
            duration={10}
            onComplete={handleTimerComplete}
            isRunning={timerRunning && !isBufferTime}
          />

          <h2 className="question-text">
            {decodeHtml(currentQuestion.question)}
          </h2>

          <div className="answers-container">
            {currentQuestion.shuffledAnswers?.map((answer, answerIndex) => (
              <QuizAnswer
                key={answerIndex}
                answer={decodeHtml(answer)}
                onClick={() => handleAnswerClick(currentQuestionIndex, answer)}
                isSelected={selectedAnswers[currentQuestionIndex] === answer}
                isCorrect={answer === currentQuestion.correct_answer}
                isBufferTime={isBufferTime}
                correctAnswer={
                  isBufferTime ? currentQuestion.correct_answer : null
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
