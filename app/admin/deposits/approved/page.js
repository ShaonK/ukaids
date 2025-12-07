"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function ApprovedDepositsPage() {
    const [deposits, setDeposits] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadDeposits() {
        const res = await fetch("/api/admin/deposits");
        const data = await res.json();
        setDeposits(data);
    }

    useEffect(() => {
        loadDeposits();
    }, []);

    // ICON
    function renderStatusIcon(status) {
        if (status === "approved")
            return <CheckCircle size={18} color="#059669" strokeWidth={2.5} />;
        if (status === "rejected")
            return <XCircle size={18} color="#DC2626" strokeWidth={2.5} />;
        return <Clock size={18} color="#D97706" strokeWidth={2.5} />;
    }

    // COPY
    function copyText(txt) {
        navigator.clipboard.writeText(txt);
        alert("Copied: " + txt);
    }

    // FILTER
    const filtered = deposits.filter((d) =>
        d.user.username.toLowerCase().includes(search.toLowerCase()) ||
        d.trxId.toString().includes(search)
    );

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-4">

            <h1 className="text-[24px] font-bold mb-4">Approved Deposits</h1>

            {/* SEARCH */}
            <input
                placeholder="Search user / trx id..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border rounded-lg mb-4 text-sm"
            />

            {/* TABLE */}
            <div className="rounded-xl bg-white border mx-auto" style={{ maxWidth: "100%" }}>

                {/* HEADER */}
                <div
                    className="grid grid-cols-4 px-3"
                    style={{
                        height: 40,
                        fontSize: 14,
                        fontWeight: 600,
                        borderBottom: "1px solid #E5E7EB",
                        alignItems: "center"
                    }}
                >
                    <span>User</span>
                    <span>Amount</span>
                    <span>TRX</span>
                    <span>Status</span>
                </div>

                {/* ROWS */}
                {paginated.map((d) => (
                    <div
                        key={d.id}
                        className="grid grid-cols-4 px-3"
                        style={{
                            height: 36,
                            fontSize: 13,
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center"
                        }}
                    >
                        {/* USER */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(d.user.username)}
                            style={{ maxWidth: 75 }}
                        >
                            {d.user.username}
                        </span>

                        {/* AMOUNT */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(d.amount)}
                        >
                            ${String(d.amount).slice(0, 5)}
                        </span>

                        {/* TRX */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(d.trxId)}
                            style={{ maxWidth: 80 }}
                        >
                            {String(d.trxId).slice(0, 6)}…
                        </span>

                        {/* STATUS */}
                        <span className="flex justify-center">
                            {renderStatusIcon(d.status)}
                        </span>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between mt-4 px-2 text-sm">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                >
                    Previous
                </button>

                <span>Page {page} / {totalPages}</span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
