"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WithdrawClient() {
  const router = useRouter();

  const [wallet, setWallet] = useState(null);
  const [pendingWithdraw, setPendingWithdraw] = useState(null);

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);

  const [loadingMove, setLoadingMove] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [msg, setMsg] = useState("");

  /* ===============================
     Load wallet
  =============================== */
  async function loadWallet() {
    const res = await fetch("/api/user/wallet");
    const data = await res.json();
    setWallet(data.wallet);
  }

  /* ===============================
     Load withdraw address
  =============================== */
  async function loadWithdrawAddress() {
    const res = await fetch("/api/user/withdraw-address");
    const data = await res.json();

    if (!data?.address || !data?.network) {
      router.replace("/user/withdraw-address");
      return false;
    }

    setAddress(data.address);
    setNetwork(data.network);
    return true;
  }

  /* ===============================
     Load pending withdraw
  =============================== */
  async function loadPendingWithdraw() {
    const res = await fetch("/api/user/withdraw/history");
    const data = await res.json();

    const pending =
      data.items?.find((w) => w.status === "pending") || null;

    setPendingWithdraw(pending);
    setAmount(pending ? pending.amount : "");
  }

  /* ===============================
     On load
  =============================== */
  useEffect(() => {
    (async () => {
      const ok = await loadWithdrawAddress();
      if (ok) {
        await loadWallet();
        await loadPendingWithdraw();
      }
    })();
  }, []);

  /* ===============================
     Move wallets → Account
  =============================== */
  async function moveWallet() {
    setLoadingMove(true);
    setMsg("");

    const res = await fetch("/api/user/move-to-account", {
      method: "POST",
    });
    const data = await res.json();

    setLoadingMove(false);

    if (!res.ok) {
      setMsg(data.error || "Wallet move failed");
      return;
    }

    setMsg(`✅ ${data.movedAmount} moved to Account`);
    loadWallet();
  }

  /* ===============================
     Submit withdraw
  =============================== */
  async function submitWithdraw() {
    if (!amount || Number(amount) <= 0) {
      setMsg("Enter valid amount");
      return;
    }

    setLoadingAction(true);
    setMsg("");

    const res = await fetch("/api/user/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        address,
        network,
      }),
    });

    const data = await res.json();
    setLoadingAction(false);

    if (!res.ok) {
      setMsg(data.error || "Withdraw failed");
      return;
    }

    setMsg("✅ Withdraw request submitted");
    loadPendingWithdraw();
    loadWallet();
  }

  /* ===============================
     Cancel withdraw
  =============================== */
  async function cancelWithdraw() {
    if (!confirm("Cancel withdraw request?")) return;

    setLoadingAction(true);
    setMsg("");

    const res = await fetch("/api/user/withdraw/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pendingWithdraw.id }),
    });

    const data = await res.json();
    setLoadingAction(false);

    if (!res.ok) {
      setMsg(data.error || "Cancel failed");
      return;
    }

    setMsg("❌ Withdraw cancelled");
    setPendingWithdraw(null);
    setAmount("");
    loadWallet();
  }

  /* ===============================
     Income wallets
  =============================== */
  const incomeWallets = [
    { label: "ROI Income", amount: wallet?.roiWallet || 0 },
    { label: "Level Income", amount: wallet?.levelWallet || 0 },
    { label: "Referral Income", amount: wallet?.referralWallet || 0 },
    { label: "Return Wallet", amount: wallet?.returnWallet || 0 },
  ];

  const incomeTotal = incomeWallets.reduce(
    (sum, w) => sum + w.amount,
    0
  );

  /* ===============================
     UI
  =============================== */
  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4 text-center">
        💸 Withdraw
      </h1>

      {/* MOVE TO ACCOUNT */}
      <div className="bg-[#1A1A1A] p-4 rounded-xl mb-4">
        <p className="text-sm text-gray-400 mb-2">
          Movable Income:{" "}
          <b className="text-green-400">${incomeTotal}</b>
        </p>

        <button
          onClick={moveWallet}
          disabled={loadingMove || incomeTotal <= 0}
          className="w-full py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          {loadingMove ? "Moving..." : "Move to Account"}
        </button>
      </div>

      {/* WITHDRAW BOX */}
      <div className="bg-[#1A1A1A] p-4 rounded-xl">
        <p className="text-sm mb-1">
          Account Balance: <b>${wallet?.mainWallet ?? 0}</b>
        </p>

        <p className="text-xs text-gray-400 mb-2">
          {network} → {address}
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 bg-black border border-gray-700 rounded mb-3"
        />

        {msg && (
          <p className="text-sm text-center text-yellow-400 mb-2">
            {msg}
          </p>
        )}

        {!pendingWithdraw ? (
          <button
            onClick={submitWithdraw}
            disabled={loadingAction}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded"
          >
            Submit Withdraw
          </button>
        ) : (
          <button
            onClick={cancelWithdraw}
            disabled={loadingAction}
            className="w-full py-2 bg-red-600 rounded"
          >
            Cancel Withdraw
          </button>
        )}

        <p className="text-xs text-gray-500 text-center mt-2">
          ⚠️ 10% commission applies
        </p>
      </div>
    </div>
  );
}
