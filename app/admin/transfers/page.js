"use client";

import { useEffect, useState } from "react";

export default function AdminTransfersPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadTransfers() {
        const res = await fetch("/api/admin/transfers");
        const data = await res.json();
        setRows(data.items || []);
        setLoading(false);
    }

    async function handleAction(id, action) {
        if (!confirm(`Are you sure to ${action} this transfer?`)) return;

        await fetch(`/api/admin/transfers/${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        loadTransfers();
    }

    useEffect(() => {
        loadTransfers();
    }, []);

    return (
        <div className="p-5 bg-[#F5F6F8] min-h-screen">
            <h1 className="text-[22px] font-bold mb-4">Transfer Requests</h1>

            {loading && <p>Loading...</p>}

            {!loading && rows.length === 0 && (
                <p>No transfer requests found</p>
            )}

            <div className="space-y-3">
                {rows.map((t) => (
                    <div
                        key={t.id}
                        className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">
                                {t.sender} → {t.receiver}
                            </p>
                            <p className="text-sm text-gray-500">
                                Amount: ${t.amount}
                            </p>
                            <p className="text-xs text-gray-400">
                                {new Date(t.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <div className="text-right">
                            <p
                                className={`text-sm font-semibold ${t.status === "APPROVED"
                                        ? "text-green-600"
                                        : t.status === "REJECTED"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                    }`}
                            >
                                {t.status}
                            </p>

                            {t.status === "PENDING" && (
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleAction(t.id, "approve")}
                                        className="px-3 py-1 bg-green-600 text-white rounded"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(t.id, "reject")}
                                        className="px-3 py-1 bg-red-600 text-white rounded"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
