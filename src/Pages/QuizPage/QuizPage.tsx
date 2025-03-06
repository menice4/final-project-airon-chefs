import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchData from "./fetchData";
import QuizAnswer from "../../Components/Quiz/QuizAnswer/QuizAnswer";
import Clock from "../../Components/Clock/Clock";

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  shuffledAnswers?: string[];
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isBufferTime, setIsBufferTime] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData();
        if (Array.isArray(data)) {
          const questionsWithShuffledAnswers = data.map((question) => ({
            ...question,
            shuffledAnswers: shuffleArray([
              question.correct_answer,
              ...question.incorrect_answers,
            ]),
          }));
          setQuestions(questionsWithShuffledAnswers);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    getData();
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
    if (selectedAnswers[questionIndex] !== undefined) {
      return;
    }
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    if (answer === questions[questionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleTimerComplete = () => {
    setIsBufferTime(true);
    setTimeout(() => {
      setIsBufferTime(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        navigate("/end");
      }
    }, 5000);
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
          <Clock key={currentQuestionIndex} duration={10} onComplete={handleTimerComplete} />
          <p>{currentQuestionIndex + 1}. {decodeHtml(currentQuestion.question)}</p>
          <ul>
            {currentQuestion.shuffledAnswers?.map((answer, answerIndex) => (
              <li key={answerIndex}>
                <QuizAnswer
                  answer={decodeHtml(answer)}
                  onClick={(answer) => handleAnswerClick(currentQuestionIndex, answer)}
                  isSelected={selectedAnswers[currentQuestionIndex] === answer}
                  isCorrect={answer === currentQuestion.correct_answer}
                  isBufferTime={isBufferTime}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


