"use client";

import { useEffect, useState } from "react";
import {
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    Copy,
} from "lucide-react";

export default function AdminDepositsPage() {
    const [deposits, setDeposits] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadDeposits() {
        const res = await fetch("/api/admin/deposits/pending");
        const data = await res.json();
        setDeposits(data);
    }

    async function approve(id) {
        const res = await fetch("/api/admin/deposit/approve", {
            method: "POST",
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
            setOpenMenu(null);
            loadDeposits();
        }
    }

    async function reject(id) {
        const res = await fetch("/api/admin/deposit/reject", {
            method: "POST",
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
            setOpenMenu(null);
            loadDeposits();
        }
    }

    useEffect(() => {
        function closeMenu(e) {
            if (!e.target.closest(".menu-button") && !e.target.closest(".action-menu")) {
                setOpenMenu(null);
            }
        }
        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    useEffect(() => {
        loadDeposits();
    }, []);

    const filtered = deposits.filter((d) =>
        d.user.username.toLowerCase().includes(search.toLowerCase()) ||
        d.trxId.toString().includes(search)
    );

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    function renderStatusIcon(status) {
        if (status === "approved")
            return <CheckCircle size={20} color="#059669" />;
        if (status === "rejected")
            return <XCircle size={20} color="#DC2626" />;
        return <Clock size={20} color="#D97706" />;
    }

    function copyText(text) {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    }

    return (
        <div className="p-4">

            <h1 className="text-xl font-bold mb-4">Pending Deposits</h1>

            <input
                type="text"
                placeholder="Search user / trx id..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="px-3 py-2 border rounded-lg w-full mb-4 text-sm"
            />

            <div className="rounded-xl overflow-hidden border bg-white">

                {/* Header */}
                <div
                    className="grid px-3 py-2 border-b bg-gray-50 font-semibold text-gray-800"
                    style={{
                        gridTemplateColumns: "1.2fr 1fr 1fr 0.6fr 0.5fr",
                        fontSize: "14px",
                    }}
                >
                    <span>User</span>
                    <span>Amount</span>
                    <span>TRX</span>
                    <span>Status</span>
                    <span className="text-center">Act</span>
                </div>

                {/* Rows */}
                {paginated.map((d) => (
                    <div
                        key={d.id}
                        className="grid px-3 py-2 border-b text-sm items-center"
                        style={{
                            gridTemplateColumns: "1.2fr 1fr 1fr 0.6fr 0.5fr",
                        }}
                    >
                        {/* USER */}
                        <span className="truncate">{d.user.username}</span>

                        {/* AMOUNT */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(d.amount)}
                        >
                            ${d.amount}
                        </span>

                        {/* TRX COPY */}
                        <span
                            className="truncate flex items-center gap-1 cursor-pointer"
                            onClick={() => copyText(d.trxId)}
                        >
                            {String(d.trxId).slice(0, 6)}
                            {String(d.trxId).length > 6 ? "…" : ""}
                            <Copy size={16} />
                        </span>

                        {/* STATUS */}
                        <span className="flex justify-center">
                            {renderStatusIcon(d.status)}
                        </span>

                        {/* ACTION */}
                        <div className="relative flex justify-center">
                            {d.status === "pending" && (
                                <>
                                    {/* Three-dot Button */}
                                    <button
                                        className="menu-button w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                                        onClick={() =>
                                            setOpenMenu(openMenu === d.id ? null : d.id)
                                        }
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {/* Dropdown Menu — now inside row center */}
                                    {openMenu === d.id && (
                                        <div
                                            className="action-menu absolute top-1/2 left-1/2 -translate-x-1/2 
                                            -translate-y-1/2 bg-white shadow-md rounded-lg border p-2 flex gap-4 z-50"
                                        >
                                            <CheckCircle
                                                size={24}
                                                className="text-green-600 cursor-pointer"
                                                onClick={() => approve(d.id)}
                                            />
                                            <XCircle
                                                size={24}
                                                className="text-red-600 cursor-pointer"
                                                onClick={() => reject(d.id)}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-3 text-sm">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
                >
                    Prev
                </button>

                <span>Page {page} / {totalPages}</span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
