import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchData from "./fetchData";
import QuizAnswer from "../../Components/Quiz/QuizAnswer/QuizAnswer";

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
      {currentQuestion && (
        <div>
          <p>{currentQuestionIndex + 1}. {decodeHtml(currentQuestion.question)}</p>
          <ul>
            {currentQuestion.shuffledAnswers?.map((answer, answerIndex) => (
              <li key={answerIndex}>
                <QuizAnswer
                  answer={decodeHtml(answer)}
                  onClick={(answer) => handleAnswerClick(currentQuestionIndex, answer)}
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


