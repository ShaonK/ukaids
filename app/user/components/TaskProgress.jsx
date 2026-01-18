"use client";
import { useEffect, useState } from "react";

export default function TaskProgress() {
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);

    // ----------------------------
    // LOAD TASK STATUS
    // ----------------------------
    async function loadStatus() {
        setLoading(true);
        const res = await fetch("/api/user/task/status", {
            cache: "no-store",
        });
        const data = await res.json();
        setStatus(data.earning || null);
        setLoading(false);
    }

    useEffect(() => {
        loadStatus();
    }, []);

    // ----------------------------
    // START TASK
    // ----------------------------
    async function startTask() {
        setRunning(true);
        setMessage("⏳ Task running...");

        await new Promise((r) => setTimeout(r, 5000));

        const res = await fetch("/api/user/task/complete", {
            method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
            setMessage("❌ " + data.error);
            setRunning(false);
            return;
        }

        setMessage("✅ Task completed. ROI added.");
        setRunning(false);
        loadStatus();
    }

    // ----------------------------
    // UI STATES
    // ----------------------------
    if (loading) {
        return (
            <div className="p-4 bg-white rounded-xl mt-4 shadow text-center">
                Checking task status…
            </div>
        );
    }

    // ❌ OFF DAY
    if (status?.reason === "OFF_DAY") {
        return (
            <div className="p-4 bg-white rounded-xl mt-4 shadow text-center">
                <p className="font-semibold text-gray-700">Task Locked</p>
                <p className="text-sm text-red-500 mt-1">
                    Task available only Monday to Friday
                </p>
            </div>
        );
    }

    // ❌ Already completed today
    if (status && !status.isReady) {
        const left =
            status.nextRunMs - Date.now();

        const mins = Math.max(0, Math.floor(left / 1000 / 60));
        const secs = Math.max(0, Math.floor((left / 1000) % 60));

        return (
            <div className="p-4 bg-white rounded-xl mt-4 shadow text-center">
                <p className="font-semibold text-gray-700">Task Completed</p>
                <p className="text-sm text-blue-600 mt-1">
                    Next task in {mins}m {secs}s
                </p>
            </div>
        );
    }

    // ✅ READY
    return (
        <div className="p-4 bg-white rounded-xl mt-4 shadow">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-lg font-semibold">Daily Task</p>
                    <p className="text-sm text-gray-500">
                        Reward: ${Number(status.amount).toFixed(2)}
                    </p>
                </div>

                <button
                    onClick={startTask}
                    disabled={running}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                    {running ? "Running..." : "Start Now"}
                </button>
            </div>

            {message && (
                <div className="mt-3 text-sm bg-gray-100 p-2 rounded">
                    {message}
                </div>
            )}
        </div>
    );
}
