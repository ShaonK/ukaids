"use client";

import { useEffect, useState } from "react";

export default function AdminWithdrawsClient() {
    const [withdraws, setWithdraws] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadWithdraws() {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/withdraws");
            const data = await res.json();
            setWithdraws(data.withdraws || []);
        } catch (e) {
            console.error("LOAD WITHDRAWS ERROR:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWithdraws();
    }, []);

    async function approveWithdraw(id) {
        if (!confirm("Confirm: Have you sent the USDT via Binance?")) return;

        try {
            const res = await fetch("/api/admin/withdraws/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Approve failed");
                return;
            }

            alert("Withdraw approved");
            loadWithdraws();
        } catch (e) {
            console.error("APPROVE ERROR:", e);
            alert("Something went wrong!");
        }
    }

    async function rejectWithdraw(id) {
        if (!confirm("Reject this withdraw request?")) return;

        try {
            const res = await fetch("/api/admin/withdraws/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Reject failed");
                return;
            }

            alert("Withdraw rejected");
            loadWithdraws();
        } catch (e) {
            console.error("REJECT ERROR:", e);
            alert("Something went wrong!");
        }
    }

    if (loading) {
        return (
            <p className="p-4 text-gray-500">
                Loading withdraw requests…
            </p>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-lg font-bold mb-4">
                Pending Withdraw Requests
            </h1>

            {withdraws.length === 0 && (
                <p className="text-gray-500">
                    No pending withdraw requests
                </p>
            )}

            <div className="space-y-4">
                {withdraws.map((w) => {
                    const address = w.user?.withdrawAddress?.address;
                    const network = w.user?.withdrawAddress?.network;

                    return (
                        <div
                            key={w.id}
                            className="bg-[#1A1A1A] text-white p-4 rounded-xl shadow"
                        >
                            <p className="text-sm">
                                👤 <b>{w.user?.username}</b>
                            </p>

                            <p className="text-sm mt-1">
                                💰 Amount: <b>${w.amount}</b>
                            </p>

                            {/* ADDRESS */}
                            <p className="text-sm mt-1">
                                📋 Address:{" "}
                                {address ? (
                                    <span className="text-green-400 break-all">
                                        {address}
                                    </span>
                                ) : (
                                    <span className="text-red-400">Not set</span>
                                )}
                            </p>

                            {/* NETWORK */}
                            <p className="text-sm mt-1">
                                🔗 Network:{" "}
                                {network ? (
                                    <span className="text-green-400">
                                        {network}
                                    </span>
                                ) : (
                                    <span className="text-red-400">—</span>
                                )}
                            </p>

                            {/* COPY BUTTON */}
                            {address && (
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(address);
                                        alert("Address copied");
                                    }}
                                    className="mt-2 text-xs px-3 py-1 rounded bg-gray-700"
                                >
                                    Copy Address
                                </button>
                            )}

                            {/* ACTIONS */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => approveWithdraw(w.id)}
                                    disabled={!address}
                                    className="px-4 py-2 rounded bg-green-600 disabled:opacity-40"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() => rejectWithdraw(w.id)}
                                    className="px-4 py-2 rounded bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>

                            {!address && (
                                <p className="text-xs text-red-400 mt-2">
                                    ⚠️ User has not set withdraw address
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
