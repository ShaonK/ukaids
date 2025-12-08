"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RechargePage() {
  const router = useRouter();

  // ⭐ তোমার Binance Deposit Address এখানে বসানো হলো
  const depositAddress = "TLaot66AMVYRtxwGeVdQgnmrrv6X9txA6L";

  const [amount, setAmount] = useState("");
  const [trx, setTrx] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ⭐ QR Image URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${depositAddress}&size=220x220`;

  // ⭐ Copy Function
  function copyAddress() {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // ⭐ Submit Deposit Function
  async function handleSubmit(e) {
    e.preventDefault();

    if (!amount || !trx) {
      alert("Please provide amount and transaction ID.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, trxId: trx }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Deposit request submitted!");

        // ⭐ Redirect to user dashboard
        router.push("/user");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 flex flex-col items-center text-white">
      <h2 className="text-xl font-semibold mb-3">Recharge / Deposit</h2>

      <div className="w-[328px] bg-[#111] rounded-lg p-4 flex flex-col items-center">

        {/* ⭐ Address Above QR */}
        <div
          onClick={copyAddress}
          className="mb-3 bg-[#222] px-3 py-2 rounded cursor-pointer text-center text-sm font-mono"
        >
          {depositAddress}
          <div className="text-xs text-orange-400">
            {copied ? "Copied!" : "Tap to copy"}
          </div>
        </div>

        {/* QR Image */}
        <img
          src={qrUrl}
          alt="QR Code"
          width={200}
          height={200}
          className="rounded mb-4"
        />

        {/* Payment Info */}
        <div className="w-full bg-[#0e0e0e] rounded p-3 mb-3 text-sm">
          <div className="mb-2">
            <div className="text-xs text-gray-300">Currency</div>
            <div className="font-semibold">USDT TRC20</div>
          </div>

          <div className="mb-2">
            <div className="text-xs text-gray-300">Deposit Address</div>
            <div className="font-mono text-sm break-words">{depositAddress}</div>
          </div>
        </div>

        {/* Form */}
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="text-xs text-gray-300">Transaction ID *</label>
          <input
            value={trx}
            onChange={(e) => setTrx(e.target.value)}
            className="w-full px-3 py-2 rounded-md mb-3 text-black"
            placeholder="Enter TRX/Hash ID"
          />

          <label className="text-xs text-gray-300">Amount *</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-md mb-3 text-black"
            placeholder="Amount sent (e.g. 25)"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EC7B03] py-2 rounded font-semibold"
          >
            {loading ? "Submitting..." : "Deposit Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
