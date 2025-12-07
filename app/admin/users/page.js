"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle, Search } from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadUsers() {
        const res = await fetch(`/api/admin/users?q=${search}`);
        const data = await res.json();
        setUsers(data || []);
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

    // SEARCH FILTER
    const filtered = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.mobile.includes(search)
    );

    // PAGINATION
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-6">

            {/* PAGE TITLE */}
            <h1 className="text-3xl font-bold mb-6">Users</h1>

            {/* SEARCH BAR */}
            <div className="flex items-center mb-4 gap-2">
                <Search size={20} className="text-gray-600" />
                <input
                    placeholder="Search user by username or mobile..."
                    className="border px-4 py-2 rounded-lg w-72 focus:ring focus:ring-blue-200 outline-none"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    onKeyUp={loadUsers}
                />
            </div>

            {/* TABLE WRAPPER */}
            <div
                className="rounded-xl overflow-hidden mx-auto"
                style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    maxWidth: "95%",
                }}
            >

                {/* TABLE HEADER */}
                <div
                    className="grid grid-cols-5 px-6"
                    style={{
                        height: "52px",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#1F2937",
                        borderBottom: "1px solid #E5E7EB",
                        alignItems: "center",
                        marginLeft: "10px",
                        marginRight: "10px",
                    }}
                >
                    <span>Username</span>
                    <span>Mobile</span>
                    <span>Joined</span>
                    <span>Status</span>
                    <span className="text-right pr-6">Action</span>
                </div>

                {/* TABLE ROWS */}
                {paginated.map((u) => (
                    <div
                        key={u.id}
                        className="grid grid-cols-5 px-6"
                        style={{
                            height: "48px",
                            fontSize: "16px",
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center",
                            color: "#1F2937",
                            marginLeft: "10px",
                            marginRight: "10px",
                        }}
                    >
                        {/* Username */}
                        <span className="truncate">{u.username}</span>

                        {/* Mobile */}
                        <span className="truncate">{u.mobile}</span>

                        {/* Joined Date */}
                        <span className="truncate">
                            {new Date(u.createdAt).toLocaleDateString()}
                        </span>

                        {/* Status Icon */}
                        <span className="flex items-center">
                            {u.isBlocked ? (
                                <Ban size={20} color="#DC2626" />
                            ) : (
                                <CheckCircle size={20} color="#059669" />
                            )}
                        </span>

                        {/* ACTION BUTTON */}
                        <div className="text-right pr-6">
                            <button
                                onClick={() => updateStatus(u.id, !u.isBlocked)}
                                className={`px-3 py-1 rounded text-sm font-medium transition ${
                                    u.isBlocked
                                        ? "bg-green-600 text-white hover:bg-green-700"
                                        : "bg-red-600 text-white hover:bg-red-700"
                                }`}
                            >
                                {u.isBlocked ? "Unblock" : "Block"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4 px-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
                >
                    Previous
                </button>

                <span className="font-medium text-gray-700">
                    Page {page} / {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
