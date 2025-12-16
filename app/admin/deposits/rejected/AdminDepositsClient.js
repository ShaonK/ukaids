"use client";

import { useEffect, useState } from "react";

export default function AdminDepositsClient() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(false);

    async function loadPending() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/deposits/pending");
            const data = await res.json();
            setPending(data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        }
        setLoading(false);
    }

    async function approve(id) {
        if (!confirm("Approve this deposit?")) return;

        try {
            const res = await fetch("/api/admin/deposit/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (data.success) {
                alert("Deposit Approved Successfully!");
                loadPending();
            } else {
                alert("Error: " + data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Something went wrong!");
        }
    }

    async function reject(id) {
        if (!confirm("Reject this deposit?")) return;

        try {
            const res = await fetch("/api/admin/deposit/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (data.success) {
                alert("Deposit Rejected Successfully!");
                loadPending();
            } else {
                alert("Error: " + data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Something went wrong!");
        }
    }

    useEffect(() => {
        loadPending();
    }, []);

    return (
        <div className="p-4 text-white">
            <h2 className="text-xl font-bold text-center mb-4">
                Pending Deposits
            </h2>

            {loading && (
                <p className="text-center text-gray-400">Loading...</p>
            )}

            {!loading && pending.length === 0 && (
                <p className="text-center text-gray-400">
                    No pending deposits found.
                </p>
            )}

            <div className="space-y-3">
                {pending.map((item) => (
                    <div
                        key={item.id}
                        className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-800 shadow"
                    >
                        <div className="flex justify-between">
                            <p className="text-sm font-semibold">
                                User ID: {item.userId}
                            </p>
                            <span className="text-yellow-400 text-xs">
                                Pending
                            </span>
                        </div>

                        <p className="text-xs text-gray-300">
                            Amount: {item.amount}
                        </p>
                        <p className="text-xs text-gray-400">
                            TRX: {item.trxId}
                        </p>
                        <p className="text-xs text-gray-500">
                            Date:{" "}
                            {new Date(item.createdAt).toLocaleString()}
                        </p>

                        <div className="flex gap-3 mt-3">
                            <button
                                onClick={() => approve(item.id)}
                                className="flex-1 bg-green-600 py-2 rounded-md"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => reject(item.id)}
                                className="flex-1 bg-red-600 py-2 rounded-md"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
