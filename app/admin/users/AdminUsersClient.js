"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle, Search } from "lucide-react";

export default function AdminUsersClient() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadUsers(query = search) {
        try {
            const res = await fetch(`/api/admin/users?q=${query}`);
            const data = await res.json();
            setUsers(data || []);
        } catch (e) {
            console.error("LOAD USERS ERROR:", e);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function updateStatus(id, status) {
        try {
            await fetch("/api/admin/user-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, isBlocked: status }),
            });
            loadUsers();
        } catch (e) {
            console.error("UPDATE STATUS ERROR:", e);
            alert("Action failed");
        }
    }

    /* --------------------
       SEARCH + PAGINATION
    -------------------- */
    const filtered = users.filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.mobile.includes(search)
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / PER_PAGE)
    );

    const paginated = filtered.slice(
        (page - 1) * PER_PAGE,
        page * PER_PAGE
    );

    function copyText(text) {
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
    }

    return (
        <div className="p-4">
            {/* PAGE TITLE */}
            <h1 className="text-2xl font-bold mb-4">
                Users
            </h1>

            {/* SEARCH */}
            <div className="flex items-center mb-3 gap-2">
                <Search size={18} className="text-gray-600" />
                <input
                    placeholder="Search user by username or mobile..."
                    className="border px-3 py-2 rounded-lg w-full focus:ring focus:ring-blue-200 outline-none text-sm"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                        loadUsers(e.target.value);
                    }}
                />
            </div>

            {/* TABLE */}
            <div
                className="rounded-xl overflow-hidden mx-auto w-full bg-white border border-gray-200"
            >
                {/* HEADER */}
                <div className="grid grid-cols-5 text-sm font-semibold bg-gray-100 h-10 items-center px-2 border-b">
                    <span>Username</span>
                    <span>Mobile</span>
                    <span>Joined</span>
                    <span className="text-center">Status</span>
                    <span className="text-right pr-3">Action</span>
                </div>

                {/* ROWS */}
                {paginated.map((u) => (
                    <div
                        key={u.id}
                        className="grid grid-cols-5 text-sm h-[42px] items-center px-2 border-b"
                    >
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(u.username)}
                        >
                            {u.username}
                        </span>

                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(u.mobile)}
                        >
                            {u.mobile}
                        </span>

                        <span
                            className="truncate cursor-pointer"
                            onClick={() =>
                                copyText(
                                    new Date(u.createdAt).toLocaleDateString()
                                )
                            }
                        >
                            {new Date(u.createdAt).toLocaleDateString()}
                        </span>

                        <span className="flex justify-center">
                            {u.isBlocked ? (
                                <Ban size={18} className="text-red-600" />
                            ) : (
                                <CheckCircle size={18} className="text-green-600" />
                            )}
                        </span>

                        <div className="text-right pr-2">
                            <button
                                onClick={() =>
                                    updateStatus(u.id, !u.isBlocked)
                                }
                                className={`px-3 py-1 text-xs rounded font-medium ${u.isBlocked
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
