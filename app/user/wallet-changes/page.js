"use client";

import { useState, useEffect } from "react";

export default function WalletChangesPage() {
  const [activeTab, setActiveTab] = useState("roi");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  // API endpoints mapped
  const apiMap = {
    roi: "/api/user/history/roi",
    level: "/api/user/history/level",
    referral: "/api/user/history/referral",
    deposit: "/api/user/history/deposit",
  };

  // Load selected tab history
  async function loadHistory(tab) {
    setLoading(true);
    try {
      const res = await fetch(apiMap[tab]);
      const data = await res.json();
      setRows(data?.history || []);
    } catch (e) {
      console.error("History Load Error:", e);
    }
    setLoading(false);
  }

  // On tab change → load data
  useEffect(() => {
    loadHistory(activeTab);
  }, [activeTab]);

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

      {/* --- PAGE TITLE --- */}
      <h2 className="text-xl font-bold mb-4 text-center">Wallet History</h2>

      {/* --- PREMIUM GRADIENT TABS --- */}
      <div className="flex mb-4">
        <TabButton id="roi" label="ROI" />
        <TabButton id="level" label="Level" />
        <TabButton id="referral" label="Referral" />
        <TabButton id="deposit" label="Deposit" />
      </div>

      {/* --- LOADING INDICATOR --- */}
      {loading && (
        <div className="text-center py-6 text-gray-400">Loading...</div>
      )}

      {/* --- HISTORY LIST --- */}
      {!loading && rows.length === 0 && (
        <p className="text-center text-gray-400 mt-6">No records found</p>
      )}

      <div className="space-y-3">
        {rows.map((item, index) => (
          <div
            key={index}
            className="bg-[#1A1A1A] p-3 rounded-lg shadow flex justify-between items-center border border-gray-800"
          >
            {/* LEFT SIDE */}
            <div>
              <p className="text-sm font-semibold text-yellow-400">
                +{item.amount} USD
              </p>
              <p className="text-xs text-gray-400">
                {item.type} • {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* RIGHT SIDE */}
            {item.from && (
              <span className="text-xs text-gray-300">
                From: {item.from}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
