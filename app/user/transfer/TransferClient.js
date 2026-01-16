"use client";

import { useEffect, useState } from "react";

const MIN_TRANSFER_AMOUNT = 5;

export default function TransferClient() {
  const [wallet, setWallet] = useState(null);

  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* ===============================
     Load wallet
  =============================== */
  async function loadWallet() {
    const res = await fetch("/api/user/wallet", {
      cache: "no-store",
    });
    const data = await res.json();
    setWallet(data.wallet || null);
  }

  useEffect(() => {
    loadWallet();
  }, []);

  /* ===============================
     Submit transfer
  =============================== */
  async function submitTransfer() {
    const numAmount = Number(amount);

    if (!receiver.trim()) {
      setMsg("Enter receiver username or ID");
      return;
    }

    if (!numAmount || numAmount <= 0) {
      setMsg("Enter a valid amount");
      return;
    }

    if (numAmount < MIN_TRANSFER_AMOUNT) {
      setMsg(`Minimum transfer amount is $${MIN_TRANSFER_AMOUNT}`);
      return;
    }

    if (numAmount > Number(wallet?.mainWallet || 0)) {
      setMsg("Insufficient account balance");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver: receiver.trim(),
          amount: numAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Transfer failed");
        return;
      }

      setMsg("✅ Balance transferred successfully");
      setReceiver("");
      setAmount("");
      loadWallet();
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     UI
  =============================== */
  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4 text-center">
        🔁 Balance Transfer
      </h1>

      <div className="bg-[#1A1A1A] p-4 rounded-xl">
        <p className="text-sm mb-2">
          Account Balance:{" "}
          <b>${Number(wallet?.mainWallet || 0).toFixed(2)}</b>
        </p>

        <input
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Receiver username or ID"
          className="w-full p-2 bg-black border border-gray-700 rounded mb-3"
        />

        <input
          type="number"
          min={MIN_TRANSFER_AMOUNT}
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Enter amount (min $${MIN_TRANSFER_AMOUNT})`}
          className="w-full p-2 bg-black border border-gray-700 rounded mb-3"
        />

        {msg && (
          <p className="text-sm text-center text-yellow-400 mb-2">
            {msg}
          </p>
        )}

        <button
          onClick={submitTransfer}
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-400 text-black font-semibold rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Transfer Balance"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          ⚠️ Minimum transfer amount ${MIN_TRANSFER_AMOUNT}
        </p>
      </div>
    </div>
  );
}
