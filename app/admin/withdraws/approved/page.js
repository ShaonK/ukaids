"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle,
    XCircle,
    Clock,
    Copy,
    Calendar
} from "lucide-react";

export default function ApprovedDepositsPage() {
    const [deposits, setDeposits] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadDeposits() {
        const res = await fetch("/api/admin/deposits");
        const data = await res.json();
        setDeposits(Array.isArray(data) ? data : []);
    }

    useEffect(() => {
        loadDeposits();
    }, []);

    // STATUS ICON
    function renderStatusIcon(status) {
        if (status === "approved") return <CheckCircle size={20} color="#059669" strokeWidth={2.4} />;
        if (status === "rejected") return <XCircle size={20} color="#DC2626" strokeWidth={2.4} />;
        return <Clock size={20} color="#D97706" strokeWidth={2.4} />;
    }

    // COPY TEXT
    function copyText(text) {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    }

    // SEARCH + PAGINATION
    const filtered = deposits.filter((d) =>
        d.user.username.toLowerCase().includes(search.toLowerCase()) ||
        d.trxId.toString().includes(search)
    );

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-6">

            {/* TITLE */}
            <h1 className="font-bold mb-4" style={{ fontSize: 28 }}>
                Approved Deposits
            </h1>

            {/* SEARCH */}
            <div className="mb-4 px-2">
                <input
                    type="text"
                    placeholder="Search user / trx id..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 border rounded-lg w-full focus:ring focus:ring-blue-200 outline-none"
                />
            </div>

            {/* TABLE CONTAINER */}
            <div
                className="rounded-xl overflow-hidden mx-auto"
                style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    maxWidth: "95%",
                    fontSize: 13
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
                    <span>TRX</span>
                    <span>Status</span>
                    <span className="text-right pr-4">Date</span>
                </div>

                {/* ROWS */}
                {paginated.map((d) => (
                    <div
                        key={d.id}
                        className="grid grid-cols-5 px-4"
                        style={{
                            height: 40,
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center",
                        }}
                    >

                        {/* USER */}
                        <span
                            className="truncate cursor-pointer"
                            style={{ maxWidth: 70 }}
                            onClick={() => copyText(d.user.username)}
                        >
                            {d.user.username}
                        </span>

                        {/* AMOUNT */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(d.amount)}
                        >
                            ${String(d.amount).length > 4
                                ? String(d.amount).slice(0, 4) + "…"
                                : d.amount}
                        </span>

                        {/* TRX ID */}
                        <span
                            className="truncate cursor-pointer flex items-center gap-1"
                            style={{ maxWidth: 80 }}
                            onClick={() => copyText(d.trxId)}
                        >
                            {String(d.trxId).length > 5
                                ? String(d.trxId).slice(0, 5) + "…"
                                : d.trxId}
                        </span>

                        {/* STATUS */}
                        <span className="flex justify-center">
                            {renderStatusIcon(d.status)}
                        </span>

                        {/* DATE (truncate + icon + tooltip) */}
                        <span
                            className="flex justify-end items-center gap-1 pr-4 cursor-pointer truncate"
                            title={new Date(d.createdAt).toLocaleString()}
                            onClick={() => copyText(new Date(d.createdAt).toLocaleDateString())}
                            style={{ maxWidth: 75 }}
                        >
                            {new Date(d.createdAt).toLocaleDateString().slice(0, 6) + "…"}
                            <Calendar size={14} className="text-gray-600" />
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
