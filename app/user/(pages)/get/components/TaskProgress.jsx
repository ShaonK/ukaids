"use client";

import { useEffect, useState } from "react";

export default function TaskProgress({ task, onStart }) {
  const [countdown, setCountdown] = useState("");

  const isReady = task?.earning?.isReady === true;
  const nextRun = task?.earning?.nextRun;

  // ----------------------------------------------------
  // ⏳ REAL-TIME COUNTDOWN (LIVE UPDATE)
  // ----------------------------------------------------
  useEffect(() => {
    if (!nextRun || isReady) {
      setCountdown("");
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const runTime = new Date(nextRun);
      const diff = runTime - now;

      if (diff <= 0) {
        setCountdown("00:00");
      } else {
        const m = Math.floor(diff / 1000 / 60);
        const s = Math.floor((diff / 1000) % 60);
        setCountdown(`${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextRun, isReady]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">

      {/* START BUTTON */}
      <button
        onClick={() => isReady && onStart()}
        disabled={!isReady}
        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
          isReady ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isReady ? "Start Now" : "Task Locked"}
      </button>

      {/* COUNTDOWN */}
      {!isReady && (
        <p className="text-center mt-3 text-gray-600">
          Next task in: <strong>{countdown}</strong>
        </p>
      )}
    </div>
  );
}
