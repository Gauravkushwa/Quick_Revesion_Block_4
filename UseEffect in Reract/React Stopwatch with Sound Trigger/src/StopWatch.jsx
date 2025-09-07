import React, { useState, useEffect } from "react";

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetTime, setTargetTime] = useState(10);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // cleanup
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (seconds === targetTime && isRunning) {
      // Play sound or console log
      const audio = new Audio(
        "https://www.soundjay.com/button/beep-07.wav" // free beep sound
      );
      audio.play();
      console.log("⏰ Target reached!");
      setIsRunning(false); // stop automatically
    }
  }, [seconds, targetTime, isRunning]);

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      <h1 className="text-2xl font-bold">⏱ Stopwatch</h1>
      <p className="text-xl">Elapsed Time: {seconds} sec</p>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded bg-green-500 text-white"
          onClick={() => setIsRunning(true)}
        >
          Start
        </button>
        <button
          className="px-4 py-2 rounded bg-yellow-500 text-white"
          onClick={() => setIsRunning(false)}
        >
          Stop
        </button>
        <button
          className="px-4 py-2 rounded bg-red-500 text-white"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <label className="mb-2">Set Target Time (seconds):</label>
        <input
          type="number"
          className="border p-2 rounded w-24 text-center"
          value={targetTime}
          onChange={(e) => setTargetTime(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
