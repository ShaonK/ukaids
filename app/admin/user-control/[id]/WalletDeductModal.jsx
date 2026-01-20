"use client";

import { useState } from "react";
import WalletDeductModal from "./WalletDeductModal";

export default function WalletDeductSection({ userId }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-4">
      <button
        onClick={() => setOpen(true)}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Deduct Wallet
      </button>

      {open && (
        <WalletDeductModal
          userId={userId}
          onClose={() => setOpen(false)}
          onSuccess={() => location.reload()}
        />
      )}
    </div>
  );
}
