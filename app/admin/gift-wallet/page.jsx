"use client";

import { useEffect, useState } from "react";

export default function AdminGiftWalletPage() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD USERS (SAFE JSON)
  ========================= */
  async function loadUsers() {
    try {
      const res = await fetch(
        `/api/admin/users?q=${q}&page=${page}&limit=5`,
        { cache: "no-store" }
      );

      // ❌ Unauthorized or server error
      if (!res.ok) {
        setUsers([]);
        setTotalPages(1);
        return;
      }

      // 🔥 SAFE PARSE
      const text = await res.text();
      if (!text) {
        setUsers([]);
        setTotalPages(1);
        return;
      }

      const data = JSON.parse(text);

      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotalPages(Number(data.totalPages) || 1);
    } catch (err) {
      console.error("loadUsers error:", err);
      setUsers([]);
      setTotalPages(1);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [q, page]);

  /* =========================
     SEND GIFT
  ========================= */
  async function sendGift() {
    if (!selectedUser || !amount) {
      alert("Select user & amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/wallet/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: Number(amount),
          note,
        }),
      });

      if (!res.ok) {
        alert("Failed to send gift");
        return;
      }

      setAmount("");
      setNote("");
      setSelectedUser(null);
      alert("🎁 Gift sent");
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">🎁 Send Gift</h1>

      {/* SEARCH */}
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="Search by ID / username / mobile"
        value={q}
        onChange={(e) => {
          setPage(1);
          setQ(e.target.value);
        }}
      />

      {/* USER LIST */}
      <div className="space-y-3">
        {users.map((u) => {
          const active = selectedUser?.id === u.id;
          return (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`border rounded-lg p-3 cursor-pointer ${
                active ? "border-blue-600 bg-blue-50" : "bg-white"
              }`}
            >
              <div className="font-medium">
                #{u.id} — {u.username}
              </div>
              <div className="text-sm text-gray-500">{u.mobile}</div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="text-center text-gray-400 py-6">
            No users found
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="disabled:opacity-40"
        >
          ◀ Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="disabled:opacity-40"
        >
          Next ▶
        </button>
      </div>

      {/* GIFT PANEL */}
      <div className="mt-6 border rounded-lg p-4 bg-gray-50">
        {!selectedUser ? (
          <div className="text-center text-gray-400">
            Select a user to send gift
          </div>
        ) : (
          <>
            <div className="mb-2 text-sm">
              <strong>{selectedUser.username}</strong>
              <div className="text-xs text-gray-500">
                {selectedUser.mobile}
              </div>
            </div>

            <input
              type="number"
              placeholder="Amount"
              className="w-full border rounded px-3 py-2 mb-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              placeholder="Note (optional)"
              className="w-full border rounded px-3 py-2 mb-3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button
              onClick={sendGift}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Gift"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
