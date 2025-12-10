"use client";

import { useState, useEffect } from "react";
import HeaderButtons from "./components/HeaderButtons";
import EarningsSummary from "./components/EarningsSummary";
import TaskProgress from "./components/TaskProgress";
import AssignmentNotice from "./components/AssignmentNotice";

export default function GetPage() {
  const [task, setTask] = useState(null);
  const [showTask, setShowTask] = useState(false);

  async function loadStatus() {
    try {
      const res = await fetch("/api/user/task/status");
      const data = await res.json();

      if (res.ok) setTask(data);
    } catch (err) {}
  }

  useEffect(() => {
    loadStatus();
    const timer = setInterval(loadStatus, 4000);
    return () => clearInterval(timer);
  }, []);

  function startTask() {
    if (task?.earning?.isReady === true) {
      setShowTask(true);
    }
  }

  async function completeTask() {
    const res = await fetch("/api/user/task/complete", { method: "POST" });
    const data = await res.json();

    if (!data.success) return alert(data.error);

    setShowTask(false);

    setTask((p) => ({
      ...p,
      earning: { ...p.earning, isReady: false },
    }));

    loadStatus();
  }

  return (
    <div className="w-full">
      <HeaderButtons startLabel="Start" taskListLabel="Task List" />

      <EarningsSummary todayEarnings={0} accountBalance={0} />

      <TaskProgress task={task} onStart={startTask} />

      <AssignmentNotice
        workDays="Mon–Fri"
        workHours="24 Hours"
        contact="Hiring Manager"
      />

      {/* POPUP */}
      {showTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[350px] text-center">

            <h3 className="text-xl font-bold mb-3">Task Running...</h3>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-pulse"></div>
            </div>

            <p className="mt-3 text-gray-700">
              Processing… Please wait.
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
