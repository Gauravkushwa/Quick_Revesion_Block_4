// TimerComponent.js
import React from "react";
import { useTimer } from "../hooks/useTimer";

export default function TimerComponent() {
  const { timer, isRunning, startTimer, stopTimer, resetTimer } = useTimer();

  return (
    <div style={{ textAlign: "center" }}>
      <h2>⏱ Timer: {timer} sec</h2>
      <p>Status: {isRunning ? "Running" : "Stopped"}</p>
      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
