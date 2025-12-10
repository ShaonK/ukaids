"use client";

import { useState, useEffect } from "react";
import HeaderButtons from "./components/HeaderButtons";
import EarningsSummary from "./components/EarningsSummary";
import TaskProgress from "./components/TaskProgress";
import AssignmentNotice from "./components/AssignmentNotice";

export default function GetPage() {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTask, setShowTask] = useState(false);
  const [error, setError] = useState("");

  // ------------------------------------------
  // 🔥 LOAD TASK STATUS FROM API
  // ------------------------------------------
  async function loadStatus() {
    try {
      setLoading(true);
      const res = await fetch("/api/user/task/status");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load");
        return;
      }

      setTaskData(data);
    } catch (err) {
      console.error("STATUS ERROR:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  // ------------------------------------------
  // 🚀 START TASK BUTTON
  // ------------------------------------------
  function startTask() {
    if (taskData?.earning?.isReady) {
      setShowTask(true);
    } else {
      alert("No active ROI cycle available now.");
    }
  }

  // ------------------------------------------
  // 🟢 COMPLETE TASK → ROI GENERATE
  // ------------------------------------------
  async function completeTask() {
    try {
      const res = await fetch("/api/user/task/complete", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        alert("Task Completed! ROI Added.");
        setShowTask(false);
        loadStatus();
      } else {
        alert(data.error || "Failed");
      }
    } catch (err) {
      console.error("COMPLETE ERROR:", err);
      alert("Server error");
    }
  }

  // ------------------------------------------
  // COUNTDOWN TIMER (optional enhancement)
  // ------------------------------------------
  let countdownText = "";
  if (taskData?.earning && !taskData.earning.isReady) {
    const next = new Date(taskData.earning.nextRun);
    const now = new Date();

    const diff = next - now; // ms
    if (diff > 0) {
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      countdownText = `Next task in ${mins}m ${secs}s`;
    }
  }

  return (
    <div className="w-full">
      <HeaderButtons startLabel="Start" taskListLabel="Task List" />

      <EarningsSummary todayEarnings={0} accountBalance={0} />

      <TaskProgress
        completed={taskData?.earning?.isReady ? 0 : 1}
        total={1}
        onStart={startTask}
      />

      {countdownText && (
        <p className="text-center text-sm text-gray-600 mt-2">{countdownText}</p>
      )}

      <AssignmentNotice
        workDays="Mon–Fri"
        workHours="24 Hours"
        contact="Hiring Manager"
      />

      {/* -------------------------
            TASK ANIMATION POPUP
        -------------------------- */}
      {showTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[350px] text-center">
            <h3 className="text-xl font-bold mb-3">Task Running...</h3>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-pulse"></div>
            </div>

            <p className="mt-3 text-gray-700">
              Processing… Please wait a moment.
            </p>

            <button
              onClick={completeTask}
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Complete Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
