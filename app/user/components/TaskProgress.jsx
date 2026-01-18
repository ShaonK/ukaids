"use client";

import { useEffect, useState } from "react";

function formatTime(ms) {
  if (!ms || ms <= 0) return null;

  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");

  return `${h}:${m}:${s}`;
}

export default function TaskProgress({ task, onStart, loading }) {
  const [countdown, setCountdown] = useState(null);

  const earning = task?.earning;

  // ⏳ Countdown handler
  useEffect(() => {
    if (!earning?.nextRunMs) {
      setCountdown(null);
      return;
    }

    const update = () => {
      const left = earning.nextRunMs - Date.now();
      setCountdown(left > 0 ? formatTime(left) : null);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [earning?.nextRunMs]);

  // ======================
  // READY STATE
  // ======================
  if (earning?.isReady) {
    return (
      <div className="mt-4 bg-white rounded-xl p-4 shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-black">
              Daily Task Available
            </p>
            <p className="text-sm text-gray-500">
              Reward: ${Number(earning.amount).toFixed(2)}
            </p>
          </div>

          <button
            onClick={onStart}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Start Now"}
          </button>
        </div>
      </div>
    );
  }

  // ======================
  // LOCKED STATE
  // ======================
  return (
    <div className="mt-4 bg-white rounded-xl p-4 shadow text-center">
      <p className="text-lg font-semibold text-gray-700">
        🔒 Task Locked
      </p>

      {earning?.reason === "OFF_DAY" && (
        <p className="text-sm text-red-500 mt-1">
          Task available only Monday to Friday
        </p>
      )}

      {countdown && (
        <div className="mt-3">
          <p className="text-sm text-gray-500">
            Next task available in
          </p>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {countdown}
          </p>
        </div>
      )}
    </div>
  );
}
