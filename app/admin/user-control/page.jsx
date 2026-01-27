"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUserControlPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/users?page=${page}&limit=10`,
          { cache: "no-store" }
        );
        const data = await res.json();

        setUsers(Array.isArray(data.users) ? data.users : []);
        setTotalPages(data.totalPages || 1);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page]);

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-semibold mb-4">
        User Control
      </h1>

      {users.length === 0 && (
        <div className="text-gray-400 text-center">
          No users found
        </div>
      )}

      <div className="space-y-3">
        {users.map(u => (
          <Link
            key={u.id}
            href={`/admin/user-control/${u.id}`}
            className="block border rounded p-3 hover:bg-gray-50"
          >
            <div className="font-medium">
              {u.username}
            </div>
            <div className="text-sm text-gray-600">
              ID: {u.id} • {u.mobile}
            </div>

            <span
              className={`inline-block mt-2 px-2 py-0.5 text-xs rounded
                ${
                  u.isBlocked
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
            >
              {u.isBlocked ? "Inactive" : "Active"}
            </span>
          </Link>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() =>
            setPage(p =>
              p < totalPages ? p + 1 : p
            )
          }
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
