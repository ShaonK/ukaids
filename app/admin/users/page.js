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
    const filtered = users.filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.mobile.includes(search)
    );

    // PAGINATION
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    // COPY FUNCTION
    function copyText(text) {
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
    }

    return (
        <div className="p-4">

            {/* PAGE TITLE */}
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            {/* SEARCH BAR */}
            <div className="flex items-center mb-3 gap-2">
                <Search size={18} className="text-gray-600" />
                <input
                    placeholder="Search user by username or mobile..."
                    className="border px-3 py-2 rounded-lg w-full focus:ring focus:ring-blue-200 outline-none text-sm"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                        loadUsers();
                    }}
                />
            </div>

            {/* TABLE WRAPPER */}
            <div
                className="rounded-xl overflow-hidden mx-auto w-full"
                style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                }}
            >
                {/* TABLE HEADER */}
                <div
                    className="grid grid-cols-5 text-sm font-semibold bg-gray-100"
                    style={{
                        height: "40px",
                        fontSize: "13px",
                        borderBottom: "1px solid #E5E7EB",
                        alignItems: "center",
                        padding: "0 10px",
                    }}
                >
                    <span className="truncate">Username</span>
                    <span className="truncate">Mobile</span>
                    <span className="truncate">Joined</span>
                    <span className="text-center truncate">Status</span>
                    <span className="text-right truncate pr-3">Action</span>
                </div>

                {/* TABLE ROWS */}
                {paginated.map((u) => (
                    <div
                        key={u.id}
                        className="grid grid-cols-5 text-sm"
                        style={{
                            height: "42px",
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center",
                            padding: "0 10px",
                        }}
                    >
                        {/* Username */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(u.username)}
                        >
                            {u.username}
                        </span>

                        {/* Mobile */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(u.mobile)}
                        >
                            {u.mobile}
                        </span>

                        {/* Joined */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() =>
                                copyText(new Date(u.createdAt).toLocaleDateString())
                            }
                        >
                            {new Date(u.createdAt).toLocaleDateString()}
                        </span>

                        {/* STATUS */}
                        <span className="flex justify-center">
                            {u.isBlocked ? (
                                <Ban size={18} className="text-red-600" />
                            ) : (
                                <CheckCircle size={18} className="text-green-600" />
                            )}
                        </span>

                        {/* ACTION BUTTON */}
                        <div className="text-right pr-2">
                            <button
                                onClick={() => updateStatus(u.id, !u.isBlocked)}
                                className={`px-3 py-1 text-xs rounded font-medium transition ${u.isBlocked
                                        ? "bg-green-600 text-white"
                                        : "bg-red-600 text-white"
                                    }`}
                            >
                                {u.isBlocked ? "Unblock" : "Block"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4 text-sm px-2">
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
