"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    async function loadUsers() {
        const res = await fetch(`/api/admin/users?q=${search}`);
        const data = await res.json();
        setUsers(data);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function updateStatus(id, status) {
        await fetch("/api/admin/user-status", {
            method: "POST",
            body: JSON.stringify({ userId: id, isBlocked: status }),
        });

        loadUsers();
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Users</h1>

            <input
                placeholder="Search user..."
                className="border p-2 rounded w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={loadUsers}
            />

            <div className="space-y-3 mt-4">
                {users.map((u) => (
                    <div
                        key={u.id}
                        className="border p-3 rounded-md bg-white shadow flex justify-between"
                    >
                        <div>
                            <p className="font-semibold">{u.username}</p>
                            <p className="text-sm text-gray-600">{u.mobile}</p>
                            <p className="text-xs text-gray-400">
                                Joined: {new Date(u.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <button
                            className={`px-3 py-1 rounded text-sm ${
                                u.isBlocked ? "bg-green-600 text-white" : "bg-red-600 text-white"
                            }`}
                            onClick={() => updateStatus(u.id, !u.isBlocked)}
                        >
                            {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
