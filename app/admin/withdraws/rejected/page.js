"use client";

import { useEffect, useState } from "react";
import { XCircle, Copy } from "lucide-react";

export default function RejectedWithdrawsPage() {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    // LOAD DATA
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
        return <XCircle size={20} color="#DC2626" strokeWidth={2.5} />;
    }

    // DATE FILTER
    function filterByDate(item) {
        const now = new Date();
        const created = new Date(item.createdAt);

        if (filter === "today")
            return created.toDateString() === now.toDateString();

        if (filter === "7d")
            return now - created <= 7 * 24 * 3600 * 1000;

        if (filter === "30d")
            return now - created <= 30 * 24 * 3600 * 1000;

        return true;
    }

    // SEARCH + FILTER
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
            <h1 className="mb-6" style={{ fontSize: 32, fontWeight: 700 }}>
                Rejected Withdraws
            </h1>

            {/* Search + Filter */}
            <div className="flex justify-between items-center mb-4 px-2">
                <input
                    type="text"
                    placeholder="Search user / wallet..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-64 outline-none"
                />

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
            <div className="rounded-xl overflow-hidden mx-auto"
                style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", maxWidth: "95%" }}>
                
                {/* HEADER */}
                <div className="grid grid-cols-5 px-6"
                    style={{ height: 52, fontSize: 18, fontWeight: 600, borderBottom: "1px solid #E5E7EB", alignItems: "center", marginLeft: 10, marginRight: 10 }}>
                    <span>User</span>
                    <span>Amount</span>
                    <span>Wallet</span>
                    <span>Status</span>
                    <span className="text-right pr-6">Date</span>
                </div>

                {/* ROWS */}
                {paginated.map((i) => (
                    <div key={i.id} className="grid grid-cols-5 px-6"
                        style={{ height: 40, fontSize: 16, borderBottom: "1px solid #E5E7EB", alignItems: "center", marginLeft: 10, marginRight: 10 }}>

                        <span className="truncate" style={{ maxWidth: 120 }}>
                            {i.user?.username || "Unknown"}
                        </span>

                        <span
                            className="truncate cursor-pointer flex gap-1"
                            onClick={() => copyText(i.amount)}
                        >
                            $
                            {String(i.amount).length > 4
                                ? String(i.amount).slice(0, 4) + "…"
                                : i.amount}
                        </span>

                        <span className="truncate">{i.walletType}</span>

                        <span className="flex justify-center">
                            {statusIcon()}
                        </span>

                        <span
                            className="text-right pr-6 truncate"
                            title={new Date(i.createdAt).toLocaleString()}
                        >
                            {new Date(i.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between mt-4 px-2">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40">
                    Previous
                </button>

                <span className="font-medium text-gray-700">
                    Page {page} / {totalPages}
                </span>

                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40">
                    Next
                </button>
            </div>
        </div>
    );
}
