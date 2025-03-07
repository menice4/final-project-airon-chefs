import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuizAnswer from "../../Components/Quiz/QuizAnswer/QuizAnswer";
import Clock from "../../Components/Clock/Clock";
import { useSocket } from "../../Context/SocketContext";
import "./QuizPageMulti.css";

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
  const [isBufferTime, setIsBufferTime] = useState(false); // Added state for buffer time
  type ScoreboardEntry = {
    player: string;
    score: number;
  };

  const [finalScores, setFinalScores] = useState<ScoreboardEntry[]>([]); // Track final scores
  const [processingNextQuestion, setProcessingNextQuestion] = useState(false); // Add this to prevent double progression
  const navigate = useNavigate();

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Use a ref to store questions in case they come in before state update
  const questionsRef = useRef<Question[]>([]);

  useEffect(() => {
    // Set the mounted flag
    isMounted.current = true;
    setProcessingNextQuestion(false); // Reset this on mount

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

    // Add listener for scoreboard updates to save the latest scores
    type ScoreboardEntry = {
      player: string;
      score: number;
    };

    const handleScoreboardUpdate = (scoreboard: ScoreboardEntry[]) => {
      if (isMounted.current) {
        setFinalScores(scoreboard);
        console.log("Updated final scores:", scoreboard);
      }
    };

    // problem is that previously, this socket could emit a "quiz-questions" event before the event listener was attached due to a delay in rendering

    // this would miss the component entirely, adn the questions would not be displayed

    // this is why we use a ref to store the questions and check if they exist before setting the state (isMounted)

    socket.on("quiz-questions", handleQuestions);
    socket.on("scoreboard-update", handleScoreboardUpdate);

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
      socket.off("scoreboard-update", handleScoreboardUpdate);
      console.log("QuizPageMulti: Cleaned up listeners");
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
    // If we're already processing a question transition, don't trigger another one
    if (processingNextQuestion) {
      console.log(
        "Already processing next question, ignoring timer completion"
      );
      return;
    }

    setProcessingNextQuestion(true); // Set lock to prevent multiple transitions
    setIsBufferTime(true); // Set buffer time to true

    console.log(`Timer completed for question ${currentQuestionIndex + 1}`);

    setTimeout(() => {
      if (!isMounted.current) return; // Safety check

      setIsBufferTime(false); // Reset buffer time after 5 seconds

      // Log the current question index before making decisions
      console.log(
        `Processing next step. Current question index: ${currentQuestionIndex}, Total questions: ${questions.length}`
      );

      if (currentQuestionIndex < questions.length - 1) {
        console.log(
          `Moving to next question: ${currentQuestionIndex + 1} -> ${
            currentQuestionIndex + 2
          }`
        );
        setCurrentQuestionIndex((prevIndex) => {
          console.log(
            `Setting question index from ${prevIndex} to ${prevIndex + 1}`
          );
          return prevIndex + 1;
        });
        // Release the lock after updating the question index
        setTimeout(() => setProcessingNextQuestion(false), 100);
      } else {
        console.log("Quiz complete, preparing for end screen");
        // Game is ending - store final scores in localStorage before navigating
        localStorage.setItem("finalScoreboard", JSON.stringify(finalScores));

        // Request a final scoreboard update before navigating
        socket?.emit("request-final-scores");

        // Allow a small delay for the final scores to be received
        setTimeout(() => {
          if (isMounted.current) {
            console.log("Navigating to end screen");
            navigate("/end");
          }
        }, 1000);
      }
    }, 5000); // 5 seconds buffer time
  };

  // Extra debugging information
  if (loading) {
    console.log("Still in loading state, questions length:", questions.length);
    console.log("Questions in ref:", questionsRef.current.length);
    return <div>Loading quiz questions...</div>;
  }

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
    <div className="quiz-multi-container">
      <h1>Welcome to the Quiz</h1>
      <p>Score: {score}</p>
      <div className="quiz-content-wrapper">
        <div className="quiz-main-content">
          <div className="question-container">
            <Clock
              key={`clock-${currentQuestionIndex}`} // Add more uniqueness to force re-render
              duration={10}
              onComplete={handleTimerComplete}
            />
            <p>
              {currentQuestionIndex + 1}. {decodeHtml(currentQuestion.question)}
            </p>
            <ul>
              {currentQuestion.shuffledAnswers?.map((answer, answerIndex) => (
                <li key={answerIndex}>
                  <QuizAnswer
                    answer={decodeHtml(answer)}
                    onClick={(answer: string) =>
                      handleAnswerClick(currentQuestionIndex, answer)
                    }
                    isSelected={
                      selectedAnswers[currentQuestionIndex] === answer
                    }
                    isCorrect={answer === currentQuestion.correct_answer}
                    isBufferTime={isBufferTime} // Pass the buffer time state
                    correctAnswer={currentQuestion.correct_answer} // Pass the correct answer
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="scoreboard-wrapper">
          <Scoreboard />
        </div>
      </div>
    </div>
  );
}
