"use client";

import { useEffect, useState } from "react";

export default function GiftHistoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const res = await fetch("/api/admin/wallet/gift-history", {
        cache: "no-store",
      });
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function undoGift(txId) {
    if (!confirm("Undo this gift?")) return;

    const res = await fetch("/api/admin/wallet/gift-undo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId: txId }),
    });

    if (!res.ok) {
      alert("Undo failed");
      return;
    }

    // 🔥 Immediately refresh list → vanished
    loadHistory();
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading gift history...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4 flex items-center gap-2">
        🎁 Gift History
      </h1>

      {rows.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No active gift history
        </div>
      )}

      <div className="space-y-4">
        {rows.map((r) => (
          <div
            key={r.id}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-sm">
                TX #{r.id}
              </div>

              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Active
              </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <strong>User:</strong> {r.user?.username}
              </div>

              <div className="text-xs text-gray-500">
                {r.user?.mobile}
              </div>

              <div>
                <strong>Amount:</strong>{" "}
                {Number(r.amount).toFixed(2)} USD
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(r.createdAt).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => undoGift(r.id)}
              className="mt-4 w-full border border-red-500 text-red-600 py-2 rounded-lg hover:bg-red-50"
            >
              Undo Gift
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
