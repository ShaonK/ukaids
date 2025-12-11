"use client";

import { useState, useEffect } from "react";
import HeaderButtons from "./components/HeaderButtons";
import EarningsSummary from "./components/EarningsSummary";
import TaskProgress from "./components/TaskProgress";
import AssignmentNotice from "./components/AssignmentNotice";

export default function GetPage() {
  const [task, setTask] = useState(null);
  const [showTask, setShowTask] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function loadStatus() {
    try {
      const res = await fetch("/api/user/task/status");
      const data = await res.json();

      if (res.ok) {
        // normalize older responses that may return { earning: ... } vs top-level
        if (data?.earning) {
          setTask(data);
        } else if (data?.hasEarning !== undefined) {
          setTask({
            hasEarning: data.hasEarning,
            earning: data.hasEarning ? data.earning : null,
          });
        } else {
          // fallback
          setTask(data);
        }
      }
    } catch (err) {
      console.error("loadStatus err", err);
    }
  }

  useEffect(() => {
    loadStatus();
    const timer = setInterval(loadStatus, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-complete flow:
  // - Show popup
  // - Optimistically set isReady=false and nextRun = now + 1 min to start client's countdown
  // - After 3s (Option C) call complete API
  async function startTask() {
    if (processing) return; // guard
    if (task?.earning?.isReady !== true) return;

    setShowTask(true);
    setProcessing(true);

    // optimistic update: set isReady false and set nextRun to now + 1 minute
    const optimisticNext = new Date(Date.now() + 1 * 60 * 1000).toISOString();

    setTask((p) => ({
      ...p,
      earning: { ...p.earning, isReady: false, nextRun: optimisticNext },
    }));

    // Auto-complete after 3 seconds (Option C)
    setTimeout(async () => {
      await completeTask(true); // true => calledFromAuto (silence some alerts)
    }, 3000);
  }

  // completeTask can be called manually (not used now) but we keep robust behavior
  async function completeTask(calledFromAuto = false) {
    try {
      const res = await fetch("/api/user/task/complete", { method: "POST" });
      const data = await res.json();

      if (!data.success) {
        // revert optimistic if server rejected
        if (!calledFromAuto) {
          alert(data.error || "Failed to complete task");
        } else {
          // show alert even if auto
          alert(data.error || "Auto-complete failed");
        }

        // refresh from server (this will possibly re-enable the button)
        await loadStatus();
        setShowTask(false);
        setProcessing(false);
        return;
      }

      // success: close popup, refresh task status from server
      setShowTask(false);
      setProcessing(false);
      // ensure client reloads fresh state from server
      await loadStatus();
    } catch (err) {
      console.error("completeTask err", err);
      alert("Server error");
      setShowTask(false);
      setProcessing(false);
      await loadStatus();
    }
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[350px] text-center">
            <h3 className="text-xl font-bold mb-3">Task Running...</h3>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-green-500 animate-progress" style={{ width: "100%" }} />
            </div>

            <p className="mt-3 text-gray-700">
              Processing… The task will auto-complete in 3 seconds.
            </p>

            {/* Message-style button (disabled) */}
            <button
              disabled
              className="mt-5 px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
            >
              Processing...
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
