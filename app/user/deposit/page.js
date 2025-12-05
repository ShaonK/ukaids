"use client";

import { useState } from "react";

export default function DepositPage() {
    const [amount, setAmount] = useState("");
    const [trxId, setTrxId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function submitDeposit() {
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/user/deposit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, trxId }),
        });

        let data = null;

        // Safe JSON Parse
        try {
            data = await res.json();
        } catch (err) {
            setMessage("❌ Invalid server response!");
            setLoading(false);
            return;
        }

        if (!res.ok || data.error) {
            setMessage(`❌ ${data?.error || "Deposit failed"}`);
        } else {
            setMessage("✅ Deposit Request Submitted!");
            setAmount("");
            setTrxId("");
        }

        setLoading(false);
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Deposit Request</h1>

            <input
                type="number"
                value={amount}
                placeholder="Amount"
                className="border p-3 rounded w-full"
                onChange={(e) => setAmount(e.target.value)}
            />

            <input
                value={trxId}
                placeholder="TRX ID"
                className="border p-3 rounded w-full"
                onChange={(e) => setTrxId(e.target.value)}
            />

            {message && (
                <p className="text-sm font-semibold">
                    {message}
                </p>
            )}

            <button
                onClick={submitDeposit}
                disabled={loading}
                className="bg-blue-600 text-white p-3 rounded w-full active:scale-95 disabled:bg-gray-400"
            >
                {loading ? "Submitting..." : "Submit Request"}
            </button>
        </div>
    );
}
