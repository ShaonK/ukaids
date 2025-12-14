"use client";

import { useEffect, useState } from "react";

export default function TaskProgress({ task, onStart, loading }) {
  const [countdown, setCountdown] = useState("");

  const isReady = task?.earning?.isReady === true;
  const nextRunMs = task?.earning?.nextRunMs;

  useEffect(() => {
    if (!nextRunMs || isReady) {
      setCountdown("");
      return;
    }

    const timer = setInterval(() => {
      const diffMs = nextRunMs - Date.now();

      if (diffMs <= 0) {
        setCountdown("00:00");
      } else {
        const totalSec = Math.floor(diffMs / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;

        setCountdown(
          `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextRunMs, isReady]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <button
        disabled={!isReady || loading}
        onClick={onStart}
        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
          isReady && !loading
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing…" : isReady ? "Start Now" : "Task Locked"}
      </button>

      {!isReady && countdown && (
        <p className="text-center mt-3 text-gray-600">
          Next task in: <strong>{countdown}</strong>
        </p>
      )}
    </div>
  );
}
