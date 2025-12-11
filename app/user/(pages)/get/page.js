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

  async function loadStatus() {
    try {
      const res = await fetch("/api/user/task/status");
      const data = await res.json();
      if (res.ok) setTask(data);
    } catch {}
  }

  useEffect(() => {
    loadStatus();
    const timer = setInterval(loadStatus, 5000);
    return () => clearInterval(timer);
  }, []);

  async function startTask() {
    if (loading) return;
    if (!task?.earning?.isReady) return;

    setLoading(true);

    const res = await fetch("/api/user/task/complete", { method: "POST" });
    const data = await res.json();

    if (!data.success) {
      toast.error(data.error);
      setLoading(false);
      return;
    }

    toast.success("Task completed!");

    // UI lock immediately
    setTask((p) => ({
      ...p,
      earning: { ...p.earning, isReady: false }
    }));

    await loadStatus();
    setLoading(false);
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
