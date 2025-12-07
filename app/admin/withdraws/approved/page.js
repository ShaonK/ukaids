"use client";
import { useEffect, useState } from "react";

export default function ApprovedWithdrawsPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("/api/admin/withdraws/approved")
      .then((res) => res.json())
      .then(setList);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Approved Withdraws</h1>

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
