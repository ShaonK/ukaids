"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";

export default function AdminWalletDeductionHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 FILTERS
  const [user, setUser] = useState("");
  const [wallet, setWallet] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (user) params.set("user", user);
      if (wallet) params.set("wallet", wallet);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(
        `/api/admin/wallet/deductions?${params.toString()}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      // ✅ SAFE NORMALIZATION
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      console.error("LOAD DEDUCTIONS ERROR:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function undo(transactionId) {
    if (!confirm("Undo this deduction?")) return;

    const res = await fetch("/api/admin/wallet/reverse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    alert("Deduction reversed");
    loadData();
  }

  return (
    <div className="min-h-screen bg-black flex justify-center">
      {/* 📱 MOBILE FRAME */}
      <div className="w-[390px] bg-white min-h-screen p-4 space-y-4">
        <h1 className="text-lg font-semibold">
          Wallet Deduction History
        </h1>

        {/* 🔍 FILTER BAR */}
        <div className="space-y-2">
          <input
            placeholder="User ID / Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <select
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">All Wallets</option>
            <option value="mainWallet">Main</option>
            <option value="roiWallet">ROI</option>
            <option value="referralWallet">Referral</option>
            <option value="levelWallet">Level</option>
            <option value="salaryWallet">Salary</option>
            <option value="donationWallet">Gift</option>
            <option value="returnWallet">Return</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border p-2 flex-1 rounded"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border p-2 flex-1 rounded"
            />
          </div>

          <button
            onClick={loadData}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Apply Filters
          </button>
        </div>

        {/* 📄 LIST */}
        {loading ? (
          <div className="text-center text-gray-500">
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-400">
            No records found
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((t) => (
              <div
                key={t.id}
                className="border rounded p-3 text-sm space-y-1"
              >
                <div className="font-medium">
                  {t.user.username} (#{t.user.id})
                </div>

                <div className="text-gray-600">
                  {new Date(t.createdAt).toLocaleString()}
                </div>

                <div>Wallet: {t.walletType}</div>

                <div className="text-red-600 font-semibold">
                  −{Number(t.amount).toFixed(2)}
                </div>

                {t.note && (
                  <div className="text-gray-600">
                    {t.note}
                  </div>
                )}

                <div className="flex justify-between items-center pt-1">
                  <span
                    className={
                      t.reversed
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {t.reversed ? "Reversed" : "Active"}
                  </span>

                  {!t.reversed && (
                    <button
                      onClick={() => undo(t.id)}
                      className="text-blue-600 underline"
                    >
                      Undo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
