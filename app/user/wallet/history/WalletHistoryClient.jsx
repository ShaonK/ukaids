"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletHistoryClient() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const apiMap = {
    account: "/api/user/history/account",
    deposit: "/api/user/history/deposit",
    roi: "/api/user/history/roi",
    level: "/api/user/history/level",
    referral: "/api/user/history/referral",
  };

  async function loadHistory(tab) {
    setLoading(true);

    let url = `${apiMap[tab]}?page=${page}&limit=10`;

    const today = new Date();
    let from = null;
    let to = today.toISOString().slice(0, 10);

    if (filter === "today") from = to;
    if (filter === "week") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      from = d.toISOString().slice(0, 10);
    }
    if (filter === "month") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      from = d.toISOString().slice(0, 10);
    }

    if (from) url += `&from=${from}&to=${to}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setRows(data?.history || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error("History load error", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    setPage(1);
    loadHistory(activeTab);
  }, [activeTab, filter]);

  useEffect(() => {
    loadHistory(activeTab);
  }, [page]);

  const TabButton = ({ id, label }) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex-1 py-2 mx-1 rounded-lg font-semibold transition ${
          active
            ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-black"
            : "bg-[#1A1A1A] text-gray-300"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-3 text-center">Wallet History</h2>

      <button
        onClick={() => router.push("/user/transfer/history")}
        className="mb-4 w-full py-2 rounded-lg bg-[#1A1A1A] border border-gray-700 text-sm text-yellow-400 hover:bg-[#222]"
      >
        🔁 View Transfer History
      </button>

      <div className="flex mb-4">
        <TabButton id="account" label="Account Balance" />
        <TabButton id="deposit" label="Deposit" />
        <TabButton id="roi" label="ROI" />
        <TabButton id="level" label="Level" />
        <TabButton id="referral" label="Referral" />
      </div>

      <div className="flex justify-between mb-4 text-sm">
        {["today", "week", "month", "all"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setPage(1);
              setFilter(f);
            }}
            className={`px-3 py-1 rounded-md ${
              filter === f
                ? "bg-yellow-500 text-black"
                : "bg-[#1A1A1A] text-gray-300"
            }`}
          >
            {f === "today"
              ? "Today"
              : f === "week"
              ? "7 Days"
              : f === "month"
              ? "30 Days"
              : "All"}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-center text-gray-400 py-6">Loading...</p>
      )}

      {!loading && rows.length === 0 && (
        <p className="text-center text-gray-400 mt-6">No records found</p>
      )}

      <div className="space-y-3">
        {rows.map((item, i) => (
          <div
            key={i}
            className="bg-[#1A1A1A] p-3 rounded-lg flex justify-between items-center border border-gray-800"
          >
            <div>
              <p
                className={`text-sm font-semibold ${
                  item.amount < 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {item.amount > 0 ? "+" : ""}
                {item.amount} USD
              </p>
              <p className="text-xs text-gray-400">
                {item.type} •{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>

            {item.from && (
              <span className="text-xs text-gray-300">
                {item.from}
              </span>
            )}
          </div>
        ))}
      </div>

      {!loading && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-[#1A1A1A] rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-gray-400 text-sm">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-[#1A1A1A] rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
