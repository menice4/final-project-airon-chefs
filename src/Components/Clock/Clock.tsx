import React, { useEffect, useState } from 'react';
import './Clock.module.css';

type TimerProps = {
  duration: number;
  onComplete: () => void;
};

const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [bufferTime, setBufferTime] = useState(5);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (bufferTime > 0) {
      timerId = setTimeout(() => {
        setBufferTime(bufferTime - 1);
      }, 1000);
    } else {
      onComplete();
    }

    return () => clearTimeout(timerId);
  }, [timeLeft, bufferTime, onComplete]);

  return (
    <div className="timer">
      <span className="clock-icon">🕒</span>
      <span className="time-left">{timeLeft > 0 ? timeLeft : ''}</span>
    </div>
  );
};

export default Timer;