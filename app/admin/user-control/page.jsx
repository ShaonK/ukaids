"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUserControlPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/users", {
          cache: "no-store",
        });
        const data = await res.json();
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

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
            className="block border rounded p-3"
          >
            <div className="font-medium">
              {u.username}
            </div>
            <div className="text-sm text-gray-600">
              ID: {u.id} • {u.mobile}
            </div>

            <span
              className={`inline-block mt-2 px-2 py-0.5 text-xs rounded
                ${u.isBlocked
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"}`}
            >
              {u.isBlocked ? "Inactive" : "Active"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
