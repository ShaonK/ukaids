"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";

export default function AdminWithdrawsPage() {
  const [withdraws, setWithdraws] = useState([]);

  async function loadWithdraws() {
    const res = await fetch("/api/admin/withdraws");
    const data = await res.json();
    setWithdraws(data);
  }

  async function updateWithdraw(id, newStatus) {
    await fetch("/api/admin/withdraw-update", {
      method: "POST",
      body: JSON.stringify({ id, status: newStatus }),
    });

    loadWithdraws();
  }

  useEffect(() => {
    loadWithdraws();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Withdraw Requests</h1>

      {withdraws.map((w) => (
        <Card key={w.id}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{w.user.username}</p>
              <p className="text-sm">{w.user.mobile}</p>

              <p className="text-xs">
                Amount: ${w.amount}
              </p>

              <p className="text-xs">
                Wallet Type: {w.walletType}
              </p>

              <p className="text-xs">
                Status:{" "}
                <span
                  className={
                    w.status === "pending"
                      ? "text-orange-600"
                      : w.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                  }
                >
                  {w.status}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => updateWithdraw(w.id, "approved")}
              >
                Approve
              </button>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => updateWithdraw(w.id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
