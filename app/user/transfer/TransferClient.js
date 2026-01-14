"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TransferClient() {
  const router = useRouter();

  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleTransfer() {
    setError(null);
    setMessage(null);

    const cleanReceiver = receiver.trim();
    const transferAmount = Number(Number(amount).toFixed(6));

    // 🔒 Validation
    if (!cleanReceiver) {
      setError("Receiver username or ID is required");
      return;
    }

    if (!transferAmount || transferAmount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to transfer $${transferAmount} to "${cleanReceiver}"?\n\n⚠️ This action is instant and irreversible.`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver: cleanReceiver,
          amount: transferAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Transfer failed");
      }

      setMessage("✅ Balance transferred successfully");
      setReceiver("");
      setAmount("");

      // 🔁 redirect to history
      setTimeout(() => {
        router.push("/user/transfer/history");
      }, 1200);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 text-white max-w-md mx-auto pb-24">
      <h1 className="text-xl font-bold text-center mb-6">
        💸 Balance Transfer
      </h1>

      <div className="bg-[#1A1A1A] rounded-xl p-4 space-y-4 border border-gray-800">

        {/* Receiver */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Receiver (Username or ID)
          </label>
          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="e.g. rahim or 12"
            disabled={loading}
            className="w-full px-3 py-2 rounded-lg bg-black border border-gray-700
            focus:outline-none focus:border-orange-500 disabled:opacity-60"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Amount (USD)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            disabled={loading}
            className="w-full px-3 py-2 rounded-lg bg-black border border-gray-700
            focus:outline-none focus:border-orange-500 disabled:opacity-60"
          />
        </div>

        {/* Info */}
        <div className="text-xs text-yellow-400 bg-black p-2 rounded-md border border-yellow-600/30">
          ⚠️ Transfers are instant and irreversible.<br />
          ❌ No ROI, bonus, or profit is generated from transfers.<br />
          💡 Transfers are deducted from your main wallet.
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded-md">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="text-sm text-green-400 bg-green-900/20 p-2 rounded-md">
            {message}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleTransfer}
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold
          bg-gradient-to-r from-orange-500 to-yellow-400
          text-black transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm Transfer"}
        </button>
      </div>
    </div>
  );
}
