"use client";
import { useState, useEffect } from "react";

export default function TaskProgress({ completed, total, onStart }) {
    const [loading, setLoading] = useState(false);
    const [taskRunning, setTaskRunning] = useState(false);
    const [message, setMessage] = useState("");
    const [countdown, setCountdown] = useState(null);

    async function startTask() {
        setTaskRunning(true);
        setMessage("⏳ Task running... please wait 5 seconds");

        // fake animation timing
        await new Promise((res) => setTimeout(res, 5000));

        setMessage("Submitting...");
        setLoading(true);

        const res = await fetch("/api/user/task/complete", {
            method: "POST",
        });

        const data = await res.json();
        setLoading(false);

        if (!data.success) {
            setMessage("❌ " + data.error);
            setTaskRunning(false);
            return;
        }

        setMessage("✅ Task Completed! ROI added.");

        // next run countdown
        const next = new Date(data.nextRun).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const left = next - now;

            if (left <= 0) {
                clearInterval(interval);
                setCountdown("New task available");
                setTaskRunning(false);
            } else {
                const mins = Math.floor(left / 1000 / 60);
                const secs = Math.floor((left / 1000) % 60);
                setCountdown(`${mins}m ${secs}s remaining`);
            }
        }, 1000);
    }

    return (
        <div className="p-4 bg-white rounded-xl mt-4 shadow">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-lg font-semibold">Daily Task</p>
                    <p className="text-sm text-gray-500">
                        {completed}/{total} completed
                    </p>
                </div>

                {!taskRunning && !countdown && (
                    <button
                        onClick={startTask}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Start Now
                    </button>
                )}

                {taskRunning && (
                    <button className="px-4 py-2 bg-gray-400 text-white rounded-lg" disabled>
                        Running...
                    </button>
                )}

                {countdown && (
                    <span className="text-blue-600 text-sm font-semibold">{countdown}</span>
                )}
            </div>

            {message && (
                <div className="mt-3 text-sm bg-gray-100 p-2 rounded">
                    {message}
                </div>
            )}
        </div>
    );
}
