"use client";

import { useEffect, useState } from "react";
import { XCircle, Copy } from "lucide-react";

export default function RejectedDepositsPage() {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    // LOAD DATA
    async function loadData() {
        const res = await fetch("/api/admin/deposits/rejected");
        const data = await res.json();
        setList(Array.isArray(data) ? data : []);
    }

    useEffect(() => {
        loadData();
    }, []);

    // COPY TEXT
    function copyText(text) {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    }

    // STATUS ICON
    function statusIcon() {
        return <XCircle size={20} color="#DC2626" strokeWidth={2.5} />;
    }

    // DATE FILTER
    function filterByDate(item) {
        const now = new Date();
        const created = new Date(item.createdAt);
        const diff = now - created;

        if (filter === "today") {
            return (
                created.getDate() === now.getDate() &&
                created.getMonth() === now.getMonth() &&
                created.getFullYear() === now.getFullYear()
            );
        }
        if (filter === "7d") return diff <= 7 * 24 * 60 * 60 * 1000;
        if (filter === "30d") return diff <= 30 * 24 * 60 * 60 * 1000;

        return true; // all
    }

    // SEARCH + FILTER
    const filtered = list
        .filter((item) => filterByDate(item))
        .filter((d) => {
            const username = d.user?.username?.toLowerCase() || "";
            return (
                username.includes(search.toLowerCase()) ||
                d.trxId.toString().includes(search)
            );
        });

    // PAGINATION
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-6">

            {/* TITLE */}
            <h1 className="mb-6" style={{ fontSize: 32, fontWeight: 700, color: "#111827" }}>
                Rejected Deposits
            </h1>

            {/* SEARCH + FILTER */}
            <div className="flex items-center justify-between mb-4 px-2">

                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search user / trx id..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-64 
                               focus:ring focus:ring-blue-200 outline-none"
                />

                {/* SELECT FILTER */}
                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                    <option value="today">Today</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="all">All</option>
                </select>
            </div>

            {/* TABLE */}
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
                    className="grid grid-cols-5 px-6"
                    style={{
                        height: 52,
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#1F2937",
                        borderBottom: "1px solid #E5E7EB",
                        alignItems: "center",
                        marginLeft: 10,
                        marginRight: 10,
                    }}
                >
                    <span>User</span>
                    <span>Amount</span>
                    <span>TRX ID</span>
                    <span>Status</span>
                    <span className="text-right pr-6">Date</span>
                </div>

                {/* ROWS */}
                {paginated.map((d) => (
                    <div
                        key={d.id}
                        className="grid grid-cols-5 px-6"
                        style={{
                            height: 40,
                            fontSize: 16,
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center",
                            color: "#1F2937",
                            marginLeft: 10,
                            marginRight: 10,
                        }}
                    >
                        {/* USER */}
                        <span className="truncate" style={{ maxWidth: 120 }}>
                            {d.user?.username || "Unknown"}
                        </span>

                        {/* AMOUNT (truncate + clickable) */}
                        <span
                            className="truncate flex items-center gap-1 cursor-pointer hover:text-blue-600"
                            onClick={() => copyText(d.amount)}
                        >
                            <span>$</span>
                            <span>
                                {String(d.amount).length > 4
                                    ? String(d.amount).slice(0, 4) + "…"
                                    : d.amount}
                            </span>
                        </span>

                        {/* TRX ID (truncate + copy icon) */}
                        <span className="truncate flex items-center gap-2" style={{ maxWidth: 160 }}>
                            {String(d.trxId).length > 6
                                ? String(d.trxId).slice(0, 6) + "…"
                                : d.trxId}

                            <Copy
                                size={16}
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => copyText(d.trxId)}
                            />
                        </span>

                        {/* STATUS ICON CENTERED */}
                        <span className="flex justify-center">
                            {statusIcon()}
                        </span>

                        {/* DATE */}
                        <span
                            className="text-right pr-6 truncate"
                            title={new Date(d.createdAt).toLocaleString()}
                        >
                            {new Date(d.createdAt).toLocaleDateString()}
                        </span>
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
