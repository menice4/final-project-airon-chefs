import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuizAnswer from "../../Components/Quiz/QuizAnswer/QuizAnswer";
import Clock from "../../Components/Clock/Clock";
import { useSocket } from "../../Context/SocketContext";

// import the scoreboard
import Scoreboard from "../../Components/ScoreBoard/ScoreBoard";

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
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Use a ref to store questions in case they come in before state update
  const questionsRef = useRef<Question[]>([]);

  useEffect(() => {
    // Set the mounted flag
    isMounted.current = true;

    if (!socket) return;

    console.log("QuizPageMulti: Setting up quiz-questions listener");

    const handleQuestions = (questionData: Question[]) => {
      console.log("QuizPageMulti: Received quiz-questions event");
      console.log(
        "QuizPageMulti: Number of questions received:",
        questionData.length
      );

      // Store in ref
      questionsRef.current = questionData;

      // Only update state if component is still mounted
      if (isMounted.current) {
        setQuestions([...questionData]);
        setLoading(false);
        console.log("State updated with questions");
      }
    };

    socket.on("quiz-questions", handleQuestions);
    // problem is that previously, this socket could emit a "quiz-questions" event before the event listener was attached due to a delay in rendering
    // this would miss the component entirely, adn the questions would not be displayed
    // this is why we use a ref to store the questions and check if they exist before setting the state (isMounted)

    // Check if we already have questions (in case event fired before listener setup)
    const checkQuestions = setTimeout(() => {
      if (loading && questionsRef.current.length > 0 && isMounted.current) {
        console.log("Using cached questions from ref");
        setQuestions([...questionsRef.current]);
        setLoading(false);
      }
    }, 500);

    return () => {
      isMounted.current = false;
      clearTimeout(checkQuestions);
      socket.off("quiz-questions", handleQuestions);
      console.log("QuizPageMulti: Cleaned up quiz-questions listener");
    };
  }, [socket, loading]);

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handleAnswerClick = (questionIndex: number, answer: string) => {
    // prevents selecting an answer if one is already selected
    if (selectedAnswers[questionIndex] !== undefined) {
      return;
    }
    // update local state with selected answer
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));

    // checks if answer is correct
    const isCorrect = answer === questions[questionIndex].correct_answer;

    // update local score
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    // and emit the answer to the server
    socket?.emit("submit-answer", {
      isCorrect,
      questionIndex,
    });
  };

  const handleTimerComplete = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      navigate("/end");
    }
  };

  // Extra debugging information
  if (loading) {
    console.log("Still in loading state, questions length:", questions.length);
    console.log("Questions in ref:", questionsRef.current.length);
    return <div>Loading quiz questions...</div>;
  }

  /*   if (error) {
    return <div>Error: {error.message}</div>;
  } */

  if (questions.length === 0) {
    return <div>No questions loaded. Please try again.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  console.log("Rendering quiz. Current question index:", currentQuestionIndex);
  console.log("Current question:", currentQuestion);

  if (!currentQuestion) {
    return <div>Question data is invalid. Please restart the quiz.</div>;
  }

  return (
    <div>
      <h1>Welcome to the Quiz</h1>
      <p>Score: {score}</p>
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
              />
            </li>
          ))}
        </ul>
      </div>

      {currentQuestionIndex === questions.length - 1 && (
        <Link to="/end">Finish</Link>
      )}
      <div className="scoreboard-wrapper">
        <Scoreboard />
      </div>
    </div>
  );
}
