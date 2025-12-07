"use client";

import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

export default function RejectedWithdrawsPage() {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadData() {
        const res = await fetch("/api/admin/withdraws/rejected");
        const data = await res.json();
        setList(data || []);
    }

    useEffect(() => {
        loadData();
    }, []);

    function copyText(text) {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    }

    function statusIcon() {
        return <XCircle size={18} color="#DC2626" strokeWidth={2.3} />;
    }

    function filterByDate(item) {
        const now = new Date();
        const created = new Date(item.createdAt);

        if (filter === "today") return created.toDateString() === now.toDateString();
        if (filter === "7d") return now - created <= 7 * 86400000;
        if (filter === "30d") return now - created <= 30 * 86400000;

        return true;
    }

    const filtered = list
        .filter(filterByDate)
        .filter((i) => {
            const username = i.user?.username?.toLowerCase() || "";
            return (
                username.includes(search.toLowerCase()) ||
                i.walletType.toLowerCase().includes(search.toLowerCase())
            );
        });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-6">
            <h1 className="mb-6 text-[28px] font-bold">Rejected Withdraws</h1>

            {/* SEARCH + FILTER (STACKED FOR MOBILE) */}
            <div className="flex flex-col gap-2 mb-4 px-1">
                <input
                    type="text"
                    placeholder="Search user / wallet..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full outline-none"
                />

                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-full"
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
                    maxWidth: "100%",
                    fontSize: "13px",
                }}
            >
                {/* HEADER */}
                <div
                    className="grid grid-cols-5 px-4"
                    style={{
                        height: 40,
                        fontWeight: 600,
                        borderBottom: "1px solid #E5E7EB",
                        alignItems: "center",
                    }}
                >
                    <span>User</span>
                    <span>Amt</span>
                    <span>Wallet</span>
                    <span className="text-center">Status</span>
                    <span className="text-right pr-2">Date</span>
                </div>

                {/* ROWS */}
                {paginated.map((i) => (
                    <div
                        key={i.id}
                        className="grid grid-cols-5 px-4"
                        style={{
                            height: 38,
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center",
                        }}
                    >
                        {/* USER */}
                        <span
                            className="truncate cursor-pointer"
                            title={i.user?.username}
                            onClick={() => copyText(i.user?.username)}
                        >
                            {i.user?.username}
                        </span>

                        {/* AMOUNT */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(i.amount)}
                        >
                            {String(i.amount).length > 4
                                ? String(i.amount).slice(0, 4) + "…"
                                : i.amount}
                        </span>

                        {/* WALLET TYPE */}
                        <span className="truncate">
                            {i.walletType === "mainWallet" ? "M/W" : "O/W"}
                        </span>

                        {/* STATUS ICON CENTER */}
                        <span className="flex justify-center">{statusIcon()}</span>

                        {/* DATE → dotted + tooltip */}
                        <span
                            className="text-right pr-2 truncate cursor-pointer"
                            title={new Date(i.createdAt).toLocaleString()}
                            onClick={() =>
                                copyText(new Date(i.createdAt).toLocaleString())
                            }
                        >
                            {new Date(i.createdAt).toLocaleDateString().slice(0, 5) + "…"}
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

                <span className="font-medium text-gray-700 text-sm">
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
