"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WithdrawRecordsClient() {
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadHistory() {
        try {
            const res = await fetch("/api/user/withdraw/history", {
                cache: "no-store",
            });
            const data = await res.json();
            setItems(Array.isArray(data.items) ? data.items : []);
        } catch (err) {
            console.error("WITHDRAW HISTORY ERROR:", err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className="p-4 text-white pb-20">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">
                    💸 Withdraw History
                </h1>

                {/* MOVE TO WITHDRAW PAGE */}
                <button
                    onClick={() => router.push("/user/withdraw")}
                    className="
            px-3 py-1.5 rounded-md text-sm font-semibold
            bg-gradient-to-r from-orange-500 to-yellow-400
            text-black
          "
                >
                    + New Withdraw
                </button>
            </div>

            {/* LOADING */}
            {loading && (
                <p className="text-center text-gray-400 mt-10">
                    Loading withdraw records...
                </p>
            )}

            {/* EMPTY */}
            {!loading && items.length === 0 && (
                <p className="text-center text-gray-400 mt-10">
                    No withdraw history found
                </p>
            )}

            {/* LIST */}
            <div className="space-y-3">
                {items.map((w) => {
                    const status = w.status?.toUpperCase();

                    return (
                        <div
                            key={w.id}
                            className="
                bg-[#1A1A1A]
                border border-gray-800
                rounded-lg p-3
              "
                        >
                            {/* TOP */}
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                    {new Date(w.createdAt).toLocaleString()}
                                </span>

                                <span
                                    className={`text-xs font-bold ${status === "APPROVED"
                                            ? "text-green-400"
                                            : status === "REJECTED"
                                                ? "text-red-400"
                                                : "text-yellow-400"
                                        }`}
                                >
                                    {status}
                                </span>
                            </div>

                            {/* BODY */}
                            <div className="mt-2 text-sm space-y-1">
                                <p>
                                    Requested Amount:{" "}
                                    <b className="text-white">${Number(w.amount).toFixed(2)}</b>
                                </p>

                                {status === "PENDING" && (
                                    <p className="text-yellow-400 text-xs">
                                        ⏳ Pending approval (amount already deducted)
                                    </p>
                                )}

                                {status === "APPROVED" && (
                                    <>
                                        <p className="text-red-400">
                                            Commission: ${Number(w.commission).toFixed(2)}
                                        </p>
                                        <p className="text-green-400">
                                            Received: ${Number(w.netAmount).toFixed(2)}
                                        </p>
                                    </>
                                )}

                                {status === "REJECTED" && (
                                    <p className="text-blue-400 text-xs">
                                        ↩ Balance returned to main wallet
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
