"use client";
import { useEffect, useState } from "react";

export default function RejectedWithdrawsPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("/api/admin/withdraws/rejected")
      .then((res) => res.json())
      .then(setList);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Rejected Withdraws</h1>

      {list.map((i) => (
        <div key={i.id} className="border p-3 rounded mb-2">
          <p>{i.user.username}</p>
          <p>Amount: ${i.amount}</p>
          <p>Wallet: {i.walletType}</p>
        </div>
      ))}
    </div>
  );
}
