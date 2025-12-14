"use client";

import { useState, useEffect } from "react";
import HeaderButtons from "./components/HeaderButtons";
import EarningsSummary from "./components/EarningsSummary";
import TaskProgress from "./components/TaskProgress";
import AssignmentNotice from "./components/AssignmentNotice";
import toast from "react-hot-toast";

export default function GetPage() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Load task status (NO CACHE)
  async function loadStatus() {
    try {
      const res = await fetch("/api/user/task/status", {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) {
        setTask(data);
      }
    } catch (err) {
      console.error("Failed to load task status", err);
    }
  }

  // 🔁 Poll status
  useEffect(() => {
    loadStatus();
    const timer = setInterval(loadStatus, 5000);
    return () => clearInterval(timer);
  }, []);

  // ▶️ Start task
  async function startTask() {
    if (loading) return;
    if (!task?.earning?.isReady) return;

    setLoading(true);

    try {
      const res = await fetch("/api/user/task/complete", {
        method: "POST",
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Task failed");
        return;
      }

      toast.success("Task completed!");

      // 🔥 Always reload fresh status from server
      await loadStatus();

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <HeaderButtons startLabel="Start" taskListLabel="Task List" />

      <EarningsSummary todayEarnings={0} accountBalance={0} />

      <TaskProgress
        task={task}
        onStart={startTask}
        loading={loading}
      />

      <AssignmentNotice
        workDays="Mon–Fri"
        workHours="24 Hours"
        contact="Hiring Manager"
      />
    </div>
  );
}
