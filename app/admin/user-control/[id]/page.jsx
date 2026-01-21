"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function AdminUserDetails(props) {
  const [userId, setUserId] = useState(undefined);
  const [user, setUser] = useState(null);

  /* 💸 Wallet Deduct State */
  const [showDeduct, setShowDeduct] = useState(false);
  const [walletType, setWalletType] = useState("mainWallet");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [deducting, setDeducting] = useState(false);

  /* 🔐 Reset Password State */
  const [resetting, setResetting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  /* ✅ unwrap params */
  useEffect(() => {
    async function resolveParams() {
      const p = await props.params;
      const id = Number(p?.id);
      if (!id || isNaN(id)) {
        setUserId(null);
        return;
      }
      setUserId(id);
    }
    resolveParams();
  }, [props.params]);

  /* ✅ load user */
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/admin/users/${userId}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [userId]);

  if (userId === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  if (userId === null) {
    return <div className="p-6 text-red-600">Invalid user ID</div>;
  }

  if (!user) {
    return <div className="p-6">Loading user...</div>;
  }

  /* 💸 Deduct wallet */
  async function handleDeduct() {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    setDeducting(true);
    try {
      const res = await fetch("/api/admin/wallet/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          walletType,
          amount: Number(amount),
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }

      alert("Wallet deducted successfully");
      setShowDeduct(false);
      setAmount("");
      setNote("");
    } catch {
      alert("Server error");
    } finally {
      setDeducting(false);
    }
  }

  /* 🔐 Reset password */
  async function handleResetPassword() {
    if (!confirm("Reset this user's password?")) return;

    setResetting(true);
    try {
      const res = await fetch(
        "/api/admin/users/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }

      setNewPassword(data.password);
      setShowReset(true);
    } catch {
      alert("Server error");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-lg font-semibold">User Details</h1>

      {/* 👤 USER INFO */}
      <div className="border rounded p-3 space-y-1">
        <div><b>ID:</b> {user.id}</div>
        <div><b>Username:</b> {user.username}</div>
        <div><b>Mobile:</b> {user.mobile}</div>

        <span
          className={`inline-block mt-2 px-2 py-0.5 text-xs rounded
          ${user.isBlocked
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"}`}
        >
          {user.isBlocked ? "Inactive" : "Active"}
        </span>
      </div>

      {/* 💸 DEDUCT WALLET */}
      <button
        onClick={() => setShowDeduct(true)}
        className="w-full bg-red-600 text-white py-2 rounded"
      >
        Deduct Wallet
      </button>

      {/* 🔐 RESET PASSWORD */}
      <button
        onClick={handleResetPassword}
        disabled={resetting}
        className="w-full border border-red-600 text-red-600 py-2 rounded"
      >
        {resetting ? "Resetting..." : "Reset Password"}
      </button>

      {/* 💳 DEDUCT MODAL */}
      {showDeduct && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-xl p-4 space-y-3">
            <h2 className="font-semibold text-lg">Deduct Wallet</h2>

            <select
              value={walletType}
              onChange={e => setWalletType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="mainWallet">Main Wallet</option>
              <option value="roiWallet">ROI Wallet</option>
              <option value="referralWallet">Referral Wallet</option>
              <option value="levelWallet">Level Wallet</option>
              <option value="salaryWallet">Salary Wallet</option>
              <option value="donationWallet">Gift Wallet</option>
              <option value="returnWallet">Return Wallet</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <input
              placeholder="Note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeduct(false)}
                className="flex-1 border py-2 rounded"
                disabled={deducting}
              >
                Cancel
              </button>

              <button
                onClick={handleDeduct}
                className="flex-1 bg-red-600 text-white py-2 rounded"
                disabled={deducting}
              >
                {deducting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔑 RESET RESULT MODAL */}
      {showReset && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-xl p-4 space-y-3">
            <h2 className="font-semibold text-lg text-red-600">
              New Password Generated
            </h2>

            <div className="border p-3 rounded bg-gray-50 text-center">
              <div className="text-sm text-gray-500 mb-1">
                This password will not be shown again
              </div>
              <div className="font-mono text-lg">
                {newPassword}
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(newPassword);
                alert("Password copied");
              }}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Copy Password
            </button>

            <button
              onClick={() => {
                setShowReset(false);
                setNewPassword("");
              }}
              className="w-full border py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
