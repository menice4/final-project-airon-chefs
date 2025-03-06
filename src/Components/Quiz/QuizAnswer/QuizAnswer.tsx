import React, { useState, useEffect } from "react";
import styles from "./QuizAnswer.module.css";

type QuizAnswerProps = {
  answer: string;
  onClick: (answer: string) => void;
  isSelected: boolean;
  isCorrect: boolean;
  isBufferTime: boolean;
  correctAnswer: string | null;
};

const QuizAnswer: React.FC<QuizAnswerProps> = ({
  answer,
  onClick,
  isSelected,
  isCorrect,
  isBufferTime,
}) => {
  const [hasSelected, setHasSelected] = useState(false);

  useEffect(() => {
    setHasSelected(false);
  }, [answer]);

  const handleClick = () => {
    if (!isBufferTime) {
      setHasSelected(true);
      onClick(answer);
    }
  };

  const buttonClass = `${styles.button} ${isSelected ? styles.selected : ""} ${
    isBufferTime && hasSelected && isCorrect ? styles.correct : ""
  } ${isBufferTime && hasSelected && !isCorrect ? styles.incorrect : ""}`;

  return (
    <button
      onClick={handleClick}
      className={buttonClass}
      disabled={isBufferTime}
    >
      {answer}
    </button>
  );
};

export default QuizAnswer;
