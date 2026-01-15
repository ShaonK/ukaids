"use client";

import { useEffect, useState } from "react";

export default function AdminWalletHistory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/admin/wallet-history", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setItems(data.items || []));
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">
        Admin Wallet Credit History
      </h1>

      <div className="bg-white rounded-xl shadow divide-y">
        {items.map(i => (
          <div key={i.id} className="p-4 flex justify-between">
            <div>
              <div className="font-semibold">
                {i.user}
              </div>
              <div className="text-sm text-gray-500">
                {i.walletType} · {new Date(i.createdAt).toLocaleString()}
              </div>
              {i.note && (
                <div className="text-xs text-gray-400">
                  {i.note}
                </div>
              )}
            </div>

            <div className="font-bold text-green-600">
              +{Number(i.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
