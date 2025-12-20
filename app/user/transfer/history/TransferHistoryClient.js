"use client";

import { useEffect, useState } from "react";

export default function TransferHistoryClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const res = await fetch("/api/user/transfer/history", {
        cache: "no-store",
      });
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error("TRANSFER HISTORY ERROR:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="p-4 text-white max-w-md mx-auto pb-20">
      <h1 className="text-xl font-bold mb-4 text-center">
        🔄 Balance Transfer History
      </h1>

      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-400 py-10">
          No transfer history found
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {new Date(t.createdAt).toLocaleString()}
                </span>

                <span
                  className={`text-xs font-semibold ${
                    t.status === "APPROVED"
                      ? "text-green-400"
                      : t.status === "REJECTED"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <div className="mt-2 flex justify-between items-center">
                <div className="text-sm">
                  {t.direction === "OUT"
                    ? `Sent to ${t.user}`
                    : `Received from ${t.user}`}
                </div>

                <div
                  className={`font-semibold ${
                    t.direction === "OUT"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {t.direction === "OUT" ? "-" : "+"}
                  ${Number(t.amount).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
