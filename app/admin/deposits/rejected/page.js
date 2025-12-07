"use client";

import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

export default function RejectedDepositsPage() {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadData() {
        const res = await fetch("/api/admin/deposits/rejected");
        const data = await res.json();
        setList(Array.isArray(data) ? data : []);
    }

    useEffect(() => {
        loadData();
    }, []);

    function copyText(text) {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    }

    function statusIcon() {
        return <XCircle size={18} color="#DC2626" strokeWidth={2.2} />;
    }

    // DATE FILTER
    function filterByDate(item) {
        const now = new Date();
        const created = new Date(item.createdAt);
        const diff = now - created;

        if (filter === "today")
            return created.toDateString() === now.toDateString();

        if (filter === "7d")
            return diff <= 7 * 24 * 60 * 60 * 1000;

        if (filter === "30d")
            return diff <= 30 * 24 * 60 * 60 * 1000;

        return true;
    }

    const filtered = list
        .filter((item) => filterByDate(item))
        .filter((d) => {
            const username = d.user?.username?.toLowerCase() || "";
            return (
                username.includes(search.toLowerCase()) ||
                d.trxId.toString().includes(search)
            );
        });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-6">

            <h1 className="text-[26px] font-bold text-[#111827] mb-5">
                Rejected Deposits
            </h1>

            {/* Search + Filter */}
            <div className="flex items-center justify-between mb-4 px-1">
                <input
                    type="text"
                    placeholder="Search user / trx id..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-[60%] text-[14px]"
                />

                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 border text-[14px] border-gray-300 rounded-lg bg-white"
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
                    className="grid grid-cols-5 px-4"
                    style={{
                        height: 40,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1F2937",
                        borderBottom: "1px solid #E5E7EB",
                        alignItems: "center",
                    }}
                >
                    <span>User</span>
                    <span>Amt</span>
                    <span>TRX</span>
                    <span>Status</span>
                    <span className="text-right">Date</span>
                </div>

                {/* ROWS */}
                {paginated.map((d) => (
                    <div
                        key={d.id}
                        className="grid grid-cols-5 px-4 text-[13px]"
                        style={{
                            height: 38,
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center",
                            color: "#1F2937",
                        }}
                    >
                        {/* USER */}
                        <span
                            className="truncate cursor-pointer"
                            title={d.user?.username}
                            onClick={() => copyText(d.user?.username)}
                        >
                            {d.user?.username}
                        </span>

                        {/* AMOUNT */}
                        <span
                            className="truncate cursor-pointer"
                            title={d.amount}
                            onClick={() => copyText(d.amount)}
                        >
                            ${String(d.amount).slice(0, 5)}
                        </span>

                        {/* TRX */}
                        <span
                            className="truncate cursor-pointer"
                            title={d.trxId}
                            onClick={() => copyText(d.trxId)}
                        >
                            {String(d.trxId).slice(0, 6)}…
                        </span>

                        {/* STATUS */}
                        <span className="flex justify-center">
                            {statusIcon()}
                        </span>

                        {/* DATE */}
                        <span
                            className="truncate text-right cursor-pointer"
                            title={new Date(d.createdAt).toLocaleString()}
                            onClick={() =>
                                copyText(new Date(d.createdAt).toLocaleString())
                            }
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
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40 text-[14px]"
                >
                    Previous
                </button>

                <span className="font-medium text-gray-700 text-[14px]">
                    Page {page} / {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40 text-[14px]"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
