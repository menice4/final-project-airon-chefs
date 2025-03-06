import React, {useState} from 'react';
import styles from './QuizAnswer.module.css';

type QuizAnswerProps = {
  answer: string;
  onClick: (answer: string) => void;
  isSelected: boolean;
  isCorrect: boolean;
};

const QuizAnswer: React.FC<QuizAnswerProps> = ({ answer, onClick, isSelected, isCorrect }) => {
  const [hasSelected, setHasSelected] = useState(false);

  const handleClick = () => {
    setHasSelected(true);
    onClick(answer);
  };

  const buttonClass = `${styles.button} ${isSelected ? styles.selected : ''} ${hasSelected && isCorrect ? styles.correct : ''} ${hasSelected && !isCorrect ? styles.incorrect : ''}`;

  return (
    <button onClick={handleClick} className={buttonClass}>
      {answer}
    </button>
  );
};

export default QuizAnswer;