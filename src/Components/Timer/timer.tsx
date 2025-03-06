import React, { useEffect, useState } from 'react';
import './Timer.module.css';

type TimerProps = {
  duration: number;
  onComplete: () => void;
};

const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, onComplete]);

  return (
    <div className="timer">
      <span className="clock-icon">🕒</span>
      <span className="time-left">{timeLeft}</span>
    </div>
  );
};

export default Timer;