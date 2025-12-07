"use client";
import { useState } from "react";

export default function WithdrawPage() {
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");

    async function submitWithdraw() {
        const res = await fetch("/api/user/withdraw", {
            method: "POST",
            body: JSON.stringify({ amount }),
        });

        const data = await res.json();
        setMessage(data.error || "Withdraw Request Submitted!");

        // ⭐ Form reset
        if (!data.error) {
            setAmount("");
        }
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Withdraw Request</h1>

            <input
                type="number"
                placeholder="Amount"
                className="border p-3 rounded w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <button
                onClick={submitWithdraw}
                className="bg-blue-600 text-white p-3 rounded w-full"
            >
                Submit
            </button>

            {message && <p className="text-green-600">{message}</p>}
        </div>
    );
}
