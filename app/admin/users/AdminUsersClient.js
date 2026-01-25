"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle, Search } from "lucide-react";

export default function AdminUsersClient() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  const PER_PAGE = 8;

  /* =========================
     LOAD USERS (SERVER PAGINATION)
  ========================= */
  async function loadUsers(query = search, pageNo = page) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?q=${query}&page=${pageNo}&limit=${PER_PAGE}`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );

      if (!res.ok) {
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
        return;
      }

      const data = await res.json();

      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotalPages(Number(data.totalPages) || 1);
      setTotalUsers(Number(data.total) || 0);
    } catch (e) {
      console.error("LOAD USERS ERROR:", e);
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }

  /* INITIAL LOAD */
  useEffect(() => {
    loadUsers();
  }, []);

  /* SEARCH */
  function handleSearch(value) {
    setSearch(value);
    setPage(1);
    loadUsers(value, 1);
  }

  /* PAGE CHANGE */
  function changePage(newPage) {
    setPage(newPage);
    loadUsers(search, newPage);
  }

  /* BLOCK / UNBLOCK */
  async function updateStatus(id, status) {
    try {
      await fetch("/api/admin/user-status", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, isBlocked: status }),
      });
      loadUsers(search, page);
    } catch {
      alert("Action failed");
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">👤 Users</h1>

      {/* TOTAL COUNT */}
      <div className="text-sm text-gray-500 mb-3">
        Total Users: <strong>{totalUsers}</strong>
      </div>

      {/* SEARCH */}
      <div className="flex items-center mb-4 gap-2">
        <Search size={18} />
        <input
          placeholder="Search by username or mobile"
          className="border px-3 py-2 rounded-lg w-full"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* USER LIST */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">
          Loading users...
        </div>
      ) : (
        <div className="space-y-3">
          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          )}

          {users.map((u) => (
            <div
              key={u.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">
                  {u.username}
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    u.isBlocked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {u.isBlocked ? (
                    <>
                      <Ban size={12} /> Blocked
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} /> Active
                    </>
                  )}
                </span>
              </div>

              {/* BODY */}
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <strong>Mobile:</strong> {u.mobile}
                </div>
                <div>
                  <strong>Joined:</strong>{" "}
                  {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* ACTION */}
              <button
                onClick={() => updateStatus(u.id, !u.isBlocked)}
                className={`mt-3 w-full py-2 rounded-lg text-white text-sm ${
                  u.isBlocked ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {u.isBlocked ? "Unblock User" : "Block User"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <button
          disabled={page <= 1}
          onClick={() => changePage(page - 1)}
          className="disabled:opacity-40"
        >
          ◀ Previous
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => changePage(page + 1)}
          className="disabled:opacity-40"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
