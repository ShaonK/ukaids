"use client";

import { useEffect, useState } from "react";

export default function AdminWithdrawsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState([]);

  async function load() {
    const res = await fetch("/api/admin/withdraws");
    const data = await res.json();
    setList(data);
  }

  async function handle(id, action) {
    setLoading((prev) => [...prev, id]);

    await fetch(`/api/admin/withdraws/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    // remove card instantly
    setList((prev) => prev.filter((w) => w.id !== id));
    setLoading((prev) => prev.filter((x) => x !== id));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Withdraw Requests</h1>

      {list.map((w) => (
        <div key={w.id} className="border p-4 rounded shadow flex justify-between">
          <div>
            <p><b>{w.user.username}</b></p>
            <p>Amount: ${w.amount}</p>
            <p>Wallet: {w.walletType}</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              disabled={loading.includes(w.id)}
              onClick={() => handle(w.id, "approve")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              disabled={loading.includes(w.id)}
              onClick={() => handle(w.id, "reject")}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
