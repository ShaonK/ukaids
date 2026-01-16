"use client";

import { useEffect, useState } from "react";

const COMMISSION_RATE = 0.1;

export default function AdminWithdrawsClient() {
    const [withdraws, setWithdraws] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal & action state
    const [selected, setSelected] = useState(null);
    const [processing, setProcessing] = useState(false);

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

    async function confirmApprove() {
        if (!selected) return;

        try {
            setProcessing(true);

            const res = await fetch("/api/admin/withdraws/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selected.id }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Approve failed");
                return;
            }

            // success → close modal & refresh list
            setSelected(null);
            loadWithdraws();
        } catch (e) {
            console.error("APPROVE ERROR:", e);
            alert("Something went wrong!");
        } finally {
            setProcessing(false);
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

                            <p className="text-sm mt-1 break-all">
                                📋 Address:{" "}
                                {address ? (
                                    <span className="text-green-400">
                                        {address}
                                    </span>
                                ) : (
                                    <span className="text-red-400">
                                        Not set
                                    </span>
                                )}
                            </p>

                            <p className="text-sm mt-1">
                                🔗 Network:{" "}
                                {network ? network : "—"}
                            </p>

                            <div className="flex gap-3 mt-4">
                                <button
                                    disabled={!address}
                                    onClick={() => setSelected(w)}
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

            {/* ================= MODAL ================= */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto">
                    <div className="min-h-screen flex items-center justify-center px-4 py-8">
                        <div className="bg-white text-black rounded-xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-lg font-bold mb-4">
                                Confirm Withdraw Approval
                            </h2>

                            <div className="text-sm mb-3">
                                <p className="font-medium mb-1">
                                    Address
                                </p>
                                <div className="bg-gray-100 p-2 rounded text-xs break-all">
                                    {
                                        selected.user
                                            ?.withdrawAddress?.address
                                    }
                                </div>
                                <button
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            selected.user
                                                ?.withdrawAddress?.address
                                        )
                                    }
                                    className="mt-1 text-xs text-blue-600"
                                >
                                    📋 Copy Address
                                </button>
                            </div>

                            {(() => {
                                const amount = Number(selected.amount);
                                const fee = Number(
                                    (amount * COMMISSION_RATE).toFixed(6)
                                );
                                const net = Number(
                                    (amount - fee).toFixed(6)
                                );

                                return (
                                    <div className="text-sm space-y-1 mb-4">
                                        <p>
                                            Requested Amount: ${amount}
                                        </p>
                                        <p>
                                            Withdraw Fee (10%): ${fee}
                                        </p>
                                        <p className="font-semibold">
                                            Final Payable: ${net}
                                        </p>
                                    </div>
                                );
                            })()}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setSelected(null)}
                                    className="px-4 py-2 rounded bg-gray-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmApprove}
                                    disabled={processing}
                                    className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-40"
                                >
                                    {processing
                                        ? "Processing..."
                                        : "Confirm & Approve"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ================= END MODAL ================= */}
        </div>
    );
}
