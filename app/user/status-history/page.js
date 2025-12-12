"use client";

import { useEffect, useState } from "react";

export default function StatusHistoryPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState("all"); // today, week, month, all

    async function loadHistory() {
        setLoading(true);

        let url = `/api/user/history/status?page=${page}&limit=10`;

        // DATE FILTERS
        const today = new Date();
        let from = null;
        let to = today.toISOString().slice(0, 10); // yyyy-mm-dd

        if (filter === "today") {
            from = to;
        } else if (filter === "week") {
            const d = new Date();
            d.setDate(d.getDate() - 7);
            from = d.toISOString().slice(0, 10);
        } else if (filter === "month") {
            const d = new Date();
            d.setDate(d.getDate() - 30);
            from = d.toISOString().slice(0, 10);
        }

        if (from) {
            url += `&from=${from}&to=${to}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();

            setRows(data?.history || []);
            setTotalPages(data?.totalPages || 1);
        } catch (err) {
            console.error("Status History Load Error:", err);
        }

        setLoading(false);
    }

    useEffect(() => {
        setPage(1);
        loadHistory();
    }, [filter]);

    useEffect(() => {
        loadHistory();
    }, [page]);

    function formatDate(item) {
        const date =
            item.startDate ??
            item.createdAt ??
            null;

        if (!date) return "Unknown";

        try {
            return new Date(date).toLocaleString();
        } catch {
            return "Unknown";
        }
    }

    return (
        <div className="p-4 text-white">

            <h2 className="text-xl font-bold text-center mb-4">Status History</h2>

            {/* FILTER BUTTONS */}
            <div className="flex justify-between mb-4 text-sm">
                {["today", "week", "month", "all"].map((f) => (
                    <button
                        key={f}
                        onClick={() => {
                            setPage(1);
                            setFilter(f);
                        }}
                        className={`px-3 py-1 rounded-md ${filter === f
                                ? "bg-yellow-500 text-black"
                                : "bg-[#1A1A1A] text-gray-300"
                            }`}
                    >
                        {f === "today"
                            ? "Today"
                            : f === "week"
                                ? "7 Days"
                                : f === "month"
                                    ? "30 Days"
                                    : "All"}
                    </button>
                ))}
            </div>

            {/* LOADING */}
            {loading && (
                <p className="text-center text-gray-400 py-4">Loading...</p>
            )}

            {/* EMPTY */}
            {!loading && rows.length === 0 && (
                <p className="text-center text-gray-400 mt-6">
                    No status change history found.
                </p>
            )}

            {/* HISTORY LIST */}
            <div className="space-y-3">
                {rows.map((item, i) => (
                    <div
                        key={i}
                        className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-800 shadow"
                    >
                        <p className="text-sm font-semibold">
                            {item.status === "active" ? (
                                <span className="text-green-400">ACTIVE</span>
                            ) : (
                                <span className="text-red-400">INACTIVE</span>
                            )}
                        </p>

                        <p className="text-xs text-gray-300 mt-1">
                            Reason: {item.reason}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                            Date: {formatDate(item)}
                        </p>

                        {item.closedAt && (
                            <p className="text-xs text-red-400 mt-1">
                                Closed: {new Date(item.closedAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            {!loading && rows.length > 0 && (
                <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
                    <button
                        className="px-3 py-2 bg-[#1A1A1A] rounded border border-gray-700 disabled:opacity-40"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Prev
                    </button>

                    <span>
                        Page {page} / {totalPages}
                    </span>

                    <button
                        className="px-3 py-2 bg-[#1A1A1A] rounded border border-gray-700 disabled:opacity-40"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
