"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminWithdrawsPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function load() {
        const res = await fetch("/api/admin/withdraws");
        const data = await res.json();
        setList(data || []);
    }

    async function handle(id, action) {
        setLoading((prev) => [...prev, id]);

        await fetch(`/api/admin/withdraws/${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        setList((prev) => prev.filter((w) => w.id !== id));
        setLoading((prev) => prev.filter((x) => x !== id));
    }

    useEffect(() => {
        load();
    }, []);

    const filtered = list.filter(
        (w) =>
            w.user.username.toLowerCase().includes(search.toLowerCase()) ||
            w.amount.toString().includes(search)
    );

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-6">

            {/* PAGE TITLE */}
            <h1 className="text-[28px] font-bold mb-4">Withdraw Requests</h1>

            {/* SEARCH BAR */}
            <input
                type="text"
                placeholder="Search user / amount..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 
                           focus:ring focus:ring-blue-200 outline-none"
            />

            {/* TABLE WRAPPER */}
            <div
                className="rounded-xl overflow-hidden mx-auto"
                style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    maxWidth: "95%",
                }}
            >

                {/* HEADER */}
                <div
                    className="grid grid-cols-5 px-4"
                    style={{
                        height: 42,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1F2937",
                        borderBottom: "1px solid #E5E7EB",
                        alignItems: "center",
                    }}
                >
                    <span className="truncate">User</span>
                    <span className="truncate">Amount</span>
                    <span className="truncate">Wallet</span>
                    <span className="truncate">Status</span>
                    <span className="truncate text-right">Action</span>
                </div>

                {/* ROWS */}
                {paginated.map((w) => (
                    <div
                        key={w.id}
                        className="grid grid-cols-5 px-4"
                        style={{
                            height: 40,
                            fontSize: 13,
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center",
                            color: "#1F2937",
                        }}
                    >
                        {/* USER */}
                        <span className="truncate">{w.user.username}</span>

                        {/* AMOUNT */}
                        <span className="truncate">${w.amount}</span>

                        {/* WALLET */}
                        <span className="truncate">{w.walletType}</span>

                        {/* STATUS ICON */}
                        <span className="flex justify-center">
                            {w.status === "approved" ? (
                                <CheckCircle size={18} color="#059669" />
                            ) : w.status === "rejected" ? (
                                <XCircle size={18} color="#DC2626" />
                            ) : (
                                <XCircle size={18} color="#D97706" />
                            )}
                        </span>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-1">
                            <button
                                disabled={loading.includes(w.id)}
                                onClick={() => handle(w.id, "approve")}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                            >
                                OK
                            </button>

                            <button
                                disabled={loading.includes(w.id)}
                                onClick={() => handle(w.id, "reject")}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                            >
                                No
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between mt-4 px-2">
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
