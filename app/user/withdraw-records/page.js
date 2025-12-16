"use client";

import { useEffect, useState } from "react";

export default function UserWithdrawHistoryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadHistory() {
        const res = await fetch("/api/user/withdraw/history");
        const data = await res.json();
        setItems(data.items || []);
        setLoading(false);
    }

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className="p-4 text-white">
            <h1 className="text-xl font-bold mb-4 text-center">
                💸 Withdraw Records
            </h1>

            {loading && (
                <p className="text-center text-gray-400">Loading...</p>
            )}

            {!loading && items.length === 0 && (
                <p className="text-center text-gray-400">
                    No withdraw history found
                </p>
            )}

            <div className="space-y-3">
                {items.map((w) => (
                    <div
                        key={w.id}
                        className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3"
                    >
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">
                                {new Date(w.createdAt).toLocaleString()}
                            </span>
                            <span
                                className={`text-sm font-semibold ${w.status === "APPROVED"
                                        ? "text-green-400"
                                        : w.status === "REJECTED"
                                            ? "text-red-400"
                                            : "text-yellow-400"
                                    }`}
                            >
                                {w.status}
                            </span>
                        </div>

                        <div className="mt-2 text-sm">
                            <p>Amount: <b>${w.amount}</b></p>

                            {w.status === "APPROVED" && (
                                <>
                                    <p className="text-red-400">
                                        Commission: ${w.commission}
                                    </p>
                                    <p className="text-green-400">
                                        Received: ${w.netAmount}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
