
import { useState, useRef, useCallback } from "react";

export function useTimer() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Start the timer
  const startTimer = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  }, [isRunning]);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Reset the timer
  const resetTimer = useCallback(() => {
    stopTimer();
    setTimer(0);
  }, [stopTimer]);

  return {
    timer,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
