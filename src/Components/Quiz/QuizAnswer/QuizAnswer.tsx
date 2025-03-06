import React from "react";
import "./QuizAnswer.css";

interface QuizAnswerProps {
  answer: string;
  onClick: () => void;
  isSelected: boolean;
  isCorrect: boolean;
  isBufferTime: boolean;
  correctAnswer: string | null;
}

const QuizAnswer: React.FC<QuizAnswerProps> = ({
  answer,
  onClick,
  isSelected,
  isCorrect,
  isBufferTime,
  correctAnswer,
}) => {
  // Determine the CSS class for the button based on state
  const getButtonClass = () => {
    const baseClass = "quiz-answer";

    if (!isBufferTime) {
      // During question time
      return isSelected ? `${baseClass} selected` : baseClass;
    } else {
      // During buffer time (showing results)
      if (answer === correctAnswer) {
        return `${baseClass} correct`; // Highlight correct answer
      } else if (isSelected) {
        return `${baseClass} ${isCorrect ? "correct" : "incorrect"}`;
      } else {
        return baseClass;
      }
    }
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick}
      disabled={isBufferTime}
    >
      <span className="answer-text">{answer}</span>
      {isBufferTime && (
        <span className="answer-icon">
          {answer === correctAnswer && "✓"}
          {isSelected && !isCorrect && "✗"}
        </span>
      )}
    </button>
  );
};

export default QuizAnswer;
