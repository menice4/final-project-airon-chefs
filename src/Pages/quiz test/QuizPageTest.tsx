import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizAnswer from "../../Components/Quiz/QuizAnswer/QuizAnswer";
import Clock from "../../Components/Clock/Clock";

import style from "./QuizPageDark.module.css"; // Corrected import statement

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  shuffledAnswers?: string[];
};

const presetQuestions: Question[] = [
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
  },
  {
    question: "What is 2 + 2?",
    correct_answer: "4",
    incorrect_answers: ["3", "5", "6"],
  },
  // Add more questions as needed
];

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isBufferTime, setIsBufferTime] = useState(false); // Added state for buffer time
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const questionsWithShuffledAnswers = presetQuestions.map((question) => ({
        ...question,
        shuffledAnswers: shuffleArray([
          question.correct_answer,
          ...question.incorrect_answers,
        ]),
      }));
      setQuestions(questionsWithShuffledAnswers);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (questionIndex: number, answer: string) => {
    if (selectedAnswers[questionIndex] !== undefined || isBufferTime) { // Prevent clicks during buffer time
      return;
    }
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    if (answer === questions[questionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleTimerComplete = () => {
    setIsBufferTime(true); // Start buffer time
    setTimeout(() => {
      setIsBufferTime(false); // End buffer time
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        navigate("/end");
      }
    }, 5000); // Buffer time duration
  };
  
  if (loading) {
    return <div className={style.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={style.errorContainer}>Error: {error.message}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={style.quizContainer}>
      <h1 className={style.h1}>Welcome to the Quiz</h1>
      <p className={style.scoreDisplay}>Score: {score}</p>
      {currentQuestion && (
        <div>
          <Clock key={currentQuestionIndex} duration={10} onComplete={handleTimerComplete} />
          <p className={style.question}>{currentQuestionIndex + 1}. {decodeHtml(currentQuestion.question)}</p>
          <ul className={`${style.answersList} ${isBufferTime ? style.bufferTime : ""}`}>
            {currentQuestion.shuffledAnswers?.map((answer, answerIndex) => (
              <li key={answerIndex} className={style.answerItem}>
                <QuizAnswer
                  answer={decodeHtml(answer)}
                  onClick={(answer) => handleAnswerClick(currentQuestionIndex, answer)}
                  isSelected={selectedAnswers[currentQuestionIndex] === answer}
                  isCorrect={answer === currentQuestion.correct_answer}
                  isBufferTime={isBufferTime} // Pass buffer time state to QuizAnswer
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


