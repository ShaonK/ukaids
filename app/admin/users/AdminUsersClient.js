"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle, Search } from "lucide-react";

export default function AdminUsersClient() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadUsers(query = "") {
        try {
            const res = await fetch(`/api/admin/users?q=${query}`, {
                cache: "no-store",
                credentials: "include", // 🔑 MUST
            });

            if (!res.ok) {
                setUsers([]);
                return;
            }

            const data = await res.json();
            setUsers(data.users || []);
        } catch (e) {
            console.error("LOAD USERS ERROR:", e);
            setUsers([]);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function updateStatus(id, status) {
        try {
            await fetch("/api/admin/user-status", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, isBlocked: status }),
            });
            loadUsers(search);
        } catch (e) {
            alert("Action failed");
        }
    }

    const filtered = users.filter(
        (u) =>
            u.username?.toLowerCase().includes(search.toLowerCase()) ||
            u.mobile?.includes(search)
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

    const paginated = filtered.slice(
        (page - 1) * PER_PAGE,
        page * PER_PAGE
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            <div className="flex items-center mb-3 gap-2">
                <Search size={18} />
                <input
                    placeholder="Search user by username or mobile..."
                    className="border px-3 py-2 rounded-lg w-full"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                        loadUsers(e.target.value);
                    }}
                />
            </div>

            <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 bg-gray-100 p-2 font-semibold text-sm">
                    <span>Username</span>
                    <span>Mobile</span>
                    <span>Joined</span>
                    <span className="text-center">Status</span>
                    <span className="text-right">Action</span>
                </div>

                {paginated.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                        No users found
                    </div>
                )}

                {paginated.map((u) => (
                    <div
                        key={u.id}
                        className="grid grid-cols-5 p-2 text-sm border-t"
                    >
                        <span>{u.username}</span>
                        <span>{u.mobile}</span>
                        <span>
                            {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex justify-center">
                            {u.isBlocked ? (
                                <Ban className="text-red-600" size={18} />
                            ) : (
                                <CheckCircle className="text-green-600" size={18} />
                            )}
                        </span>
                        <div className="text-right">
                            <button
                                onClick={() => updateStatus(u.id, !u.isBlocked)}
                                className={`px-3 py-1 rounded text-white text-xs ${u.isBlocked ? "bg-green-600" : "bg-red-600"
                                    }`}
                            >
                                {u.isBlocked ? "Unblock" : "Block"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-4 text-sm">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {page} / {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
