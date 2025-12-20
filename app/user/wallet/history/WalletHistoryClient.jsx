"use client";

import { useEffect, useState } from "react";

const TABS = [
  { key: "account", label: "Account" },
  { key: "deposit", label: "Deposit" },
  { key: "roi", label: "ROI" },
  { key: "level", label: "Level" },
  { key: "referral", label: "Referral" },
];

function normalize(row) {
  return {
    amount: Number(row.amount) || 0,
    type: row.type || "Unknown",
    from: row.from || "-",
    createdAt: new Date(row.createdAt),
  };
}

export default function WalletHistoryClient() {
  const [tab, setTab] = useState("account");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/user/history/${tab}?page=${page}&limit=10`,
        { cache: "no-store" }
      );

      const data = await res.json();

      const history = Array.isArray(data.history)
        ? data.history.map(normalize)
        : [];

      setRows(history);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("WALLET HISTORY ERROR:", err);
      setRows([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
  }, [tab]);

  useEffect(() => {
    load();
  }, [tab, page]);

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4 text-center">
        Wallet History
      </h2>

      {/* TABS */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded text-sm whitespace-nowrap ${
              tab === t.key
                ? "bg-yellow-500 text-black"
                : "bg-[#1A1A1A] text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 py-6">
            Loading...
          </p>
        ) : rows.length === 0 ? (
          <p className="text-center text-gray-400 py-6">
            No history found.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-black/40">
              <tr>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">From</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-800"
                >
                  <td className="p-2">{r.type}</td>
                  <td className="p-2 text-gray-400">
                    {r.from}
                  </td>
                  <td
                    className={`p-2 text-right ${
                      r.amount >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {r.amount.toFixed(2)}
                  </td>
                  <td className="p-2 text-right text-gray-400">
                    {r.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-[#1A1A1A] rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-400">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-[#1A1A1A] rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
