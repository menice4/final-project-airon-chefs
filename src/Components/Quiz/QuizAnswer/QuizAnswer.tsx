import React from 'react';
import styles from './QuizAnswer.module.css';

type QuizAnswerProps = {
  answer: string;
  onClick: (answer: string) => void;
  isSelected: boolean;
  isCorrect: boolean;
};

const QuizAnswer: React.FC<QuizAnswerProps> = ({ answer, onClick, isSelected, isCorrect }) => {
  const buttonClass = isSelected ? (isCorrect ? styles.correct : styles.incorrect) : '';

  return (
    <button onClick={() => onClick(answer)} className={`${styles.button} ${buttonClass}`}>
      {answer}
    </button>
  );
};

export default QuizAnswer;