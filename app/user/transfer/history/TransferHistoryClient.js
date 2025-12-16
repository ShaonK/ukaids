"use client";

import { useEffect, useState } from "react";

export default function TransferHistoryClient() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadHistory() {
        try {
            const res = await fetch("/api/user/transfer/history", {
                cache: "no-store",
            });
            const data = await res.json();
            setRows(data?.items || []);
        } catch (err) {
            console.error("TRANSFER HISTORY ERROR:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className="p-4 text-white pb-20">
            <h2 className="text-xl font-bold text-center mb-4">
                🔁 Transfer History
            </h2>

            {loading && (
                <p className="text-center text-gray-400">
                    Loading…
                </p>
            )}

            {!loading && rows.length === 0 && (
                <p className="text-center text-gray-400">
                    No transfers found
                </p>
            )}

            <div className="space-y-3">
                {rows.map((t, i) => (
                    <div
                        key={i}
                        className="bg-[#1A1A1A] p-3 rounded-lg border border-gray-800"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-sm">
                                {t.direction === "OUT"
                                    ? "Sent to"
                                    : "Received from"}{" "}
                                <b>{t.user}</b>
                            </span>

                            <span
                                className={`font-semibold ${t.direction === "OUT"
                                        ? "text-red-400"
                                        : "text-green-400"
                                    }`}
                            >
                                {t.direction === "OUT" ? "-" : "+"}
                                {t.amount} USD
                            </span>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>
                                {new Date(t.createdAt).toLocaleString()}
                            </span>

                            <span
                                className={
                                    t.status === "APPROVED"
                                        ? "text-green-400"
                                        : t.status === "REJECTED"
                                            ? "text-red-400"
                                            : "text-yellow-400"
                                }
                            >
                                {t.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
