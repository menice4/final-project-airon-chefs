import React, { useEffect, useState, useRef } from "react";
import "./Clock.css";

interface ClockProps {
  duration: number;
  onComplete: () => void;
  isRunning?: boolean; // New prop to control when the clock is running
}

const Clock: React.FC<ClockProps> = ({
  duration,
  onComplete,
  isRunning = true, // Default to running
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<number | null>(null);

  // Reset timer when duration changes or component remounts
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Handle the timer logic
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only run the timer if it's supposed to be running
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    // Timer has reached zero
    else if (isRunning && timeLeft === 0) {
      onComplete();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isRunning, onComplete]);

  // Calculate percentage for visual indicators
  const progressPercentage = (timeLeft / duration) * 100;

  // Determine color based on time left
  const getTimerColor = () => {
    if (timeLeft > duration * 0.6) return "#28a745"; // Green for plenty of time
    if (timeLeft > duration * 0.3) return "#ffc107"; // Yellow for getting low
    return "#dc3545"; // Red for running out of time
  };

  return (
    <div className="clock-container">
      <div
        className="clock-progress"
        style={{
          width: `${progressPercentage}%`,
          backgroundColor: getTimerColor(),
        }}
      />
      <div className="clock-display">
        <span className="clock-icon">⏱️</span>
        <span
          className="time-left"
          style={{ color: timeLeft <= 3 ? "#dc3545" : "inherit" }}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default Clock;
