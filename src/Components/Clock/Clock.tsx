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
    if (timeLeft === 0 && bufferTime === 0) {
      onComplete();
      return;
    }
    if (timeLeft > 0) {
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timerId);
  } else if (bufferTime > 0){
    const bufferId = setTimeout(() => {
      setBufferTime(bufferTime - 1);
    }, 1000);
    return () => clearTimeout(bufferId);
  }
}, [timeLeft, bufferTime, onComplete]);

  return (
    <div className="timer">
      <span className="clock-icon">🕒</span>
      <span className="time-left">{timeLeft > 0 ? timeLeft : bufferTime}</span>
    </div>
  );
};

export default Timer;