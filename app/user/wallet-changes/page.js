"use client";

import { useState, useEffect } from "react";

export default function WalletChangesPage() {
  const [activeTab, setActiveTab] = useState("roi");   // ROI / Level / Referral / Deposit
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  // NEW STATES
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");  // today, week, month, all

  // API endpoints mapped
  const apiMap = {
    roi: "/api/user/history/roi",
    level: "/api/user/history/level",
    referral: "/api/user/history/referral",
    deposit: "/api/user/history/deposit",
  };

  // LOAD HISTORY WITH FILTER + PAGINATION
  async function loadHistory(tab) {
    setLoading(true);

    let url = `${apiMap[tab]}?page=${page}&limit=10`;

    // DATE FILTERING
    const today = new Date();
    let from = null;
    let to = today.toISOString().slice(0, 10);

    if (filter === "today") {
      from = to;
    } else if (filter === "week") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      from = d.toISOString().slice(0, 10);
    } else if (filter === "month") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      from = d.toISOString().slice(0, 10);
    }

    if (from) {
      url += `&from=${from}&to=${to}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setRows(data?.history || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error("History Load Error:", err);
    }

    setLoading(false);
  }

  // Reload when tab changes
  useEffect(() => {
    setPage(1);
    loadHistory(activeTab);
  }, [activeTab, filter]);

  // Reload when page changes
  useEffect(() => {
    loadHistory(activeTab);
  }, [page]);

  // Gradient premium tab style
  const TabButton = ({ id, label }) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`
          flex-1 py-2 text-center font-semibold rounded-lg mx-1 transition-all
          ${active
            ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-black shadow-lg scale-100"
            : "bg-[#1A1A1A] text-gray-300"
          }
        `}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="p-4 text-white">

      {/* --- TITLE --- */}
      <h2 className="text-xl font-bold mb-4 text-center">Wallet History</h2>

      {/* --- TABS --- */}
      <div className="flex mb-4">
        <TabButton id="roi" label="ROI" />
        <TabButton id="level" label="Level" />
        <TabButton id="referral" label="Referral" />
        <TabButton id="deposit" label="Deposit" />
      </div>

      {/* --- QUICK FILTERS --- */}
      <div className="flex justify-between mb-4 text-sm">
        {["today", "week", "month", "all"].map(f => (
          <button
            key={f}
            onClick={() => {
              setPage(1);
              setFilter(f);
            }}
            className={`
              px-3 py-1 rounded-md 
              ${filter === f ? "bg-yellow-500 text-black" : "bg-[#1A1A1A] text-gray-300"}
            `}
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

      {/* --- LOADING --- */}
      {loading && (
        <div className="text-center py-6 text-gray-400">Loading...</div>
      )}

      {/* --- EMPTY --- */}
      {!loading && rows.length === 0 && (
        <p className="text-center text-gray-400 mt-6">No records found</p>
      )}

      {/* --- HISTORY LIST --- */}
      <div className="space-y-3">
        {rows.map((item, index) => (
          <div
            key={index}
            className="bg-[#1A1A1A] p-3 rounded-lg shadow flex justify-between items-center border border-gray-800"
          >
            <div>
              <p className="text-sm font-semibold text-yellow-400">
                +{item.amount} USD
              </p>
              <p className="text-xs text-gray-400">
                {item.type} • {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>

            {item.from && (
              <span className="text-xs text-gray-300">
                From: {item.from}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* --- PAGINATION BUTTONS --- */}
      {!loading && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 bg-[#1A1A1A] rounded text-gray-300 border border-gray-700 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-gray-400 text-sm">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-[#1A1A1A] rounded text-gray-300 border border-gray-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}
