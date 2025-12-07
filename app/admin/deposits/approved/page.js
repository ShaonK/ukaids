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
        const res = await fetch("/api/admin/deposits");
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

    // Outside click close
    useEffect(() => {
        function handleOutside(e) {
            if (!e.target.closest(".menu-dropdown") &&
                !e.target.closest(".menu-button")) {
                setOpenMenu(null);
            }
        }

        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    useEffect(() => {
        loadDeposits();
    }, []);

    // Status Icon
    function renderStatusIcon(status) {
        if (status === "approved")
            return <CheckCircle size={20} color="#059669" strokeWidth={2.5} />;
        if (status === "rejected")
            return <XCircle size={20} color="#DC2626" strokeWidth={2.5} />;
        return <Clock size={20} color="#D97706" strokeWidth={2.5} />;
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

            {/* PAGE TITLE */}
            <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#111827", marginLeft: "10px" }}>
                Deposit Requests
            </h1>

            {/* SEARCH BAR */}
            <div className="mt-4 mb-4 flex justify-between items-center px-2">
                <input
                    type="text"
                    placeholder="Search user / trx id..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-64 
                               focus:ring focus:ring-blue-200 outline-none"
                />
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
                        height: "52px",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#1F2937",
                        borderBottom: "1px solid #E5E7EB",
                        alignItems: "center",
                        marginLeft: "10px",
                        marginRight: "10px",
                    }}
                >
                    <span>User</span>
                    <span>Amount</span>
                    <span>TRX ID</span>
                    <span>Status</span>
                    <span className="text-right pr-6">Actions</span>
                </div>

                {/* ROWS */}
                {paginated.map((d) => (
                    <div
                        key={d.id}
                        className="grid grid-cols-5 px-6 relative gap-2"
                        style={{
                            height: "40px",
                            fontSize: "16px",
                            borderBottom: "1px solid #E5E7EB",
                            alignItems: "center",
                            color: "#1F2937",
                            marginLeft: "10px",
                            marginRight: "10px",
                        }}
                    >

                        {/* USER */}
                        <span className="truncate" style={{ maxWidth: "120px" }}>
                            {d.user.username}
                        </span>

                        {/* AMOUNT (limit 4 chars + $ icon + click-to-copy alert) */}
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

                        {/* TRX ID (limit 5 chars + copy icon) */}
                        <span className="truncate flex items-center gap-2" style={{ maxWidth: "160px" }}>
                            {String(d.trxId).length > 5
                                ? String(d.trxId).slice(0, 5) + "…"
                                : d.trxId}

                            <Copy
                                size={16}
                                className="cursor-pointer hover:text-blue-600"
                                onClick={() => copyText(d.trxId)}
                            />
                        </span>

                        {/* STATUS ICON */}
                        <span className="flex items-center justify-center">
                            {renderStatusIcon(d.status)}
                        </span>

                        {/* ACTION MENU */}
                        <div className="relative flex justify-end pr-6">

                            {d.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => setOpenMenu(openMenu === d.id ? null : d.id)}
                                        className="menu-button w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all active:scale-90"
                                    >
                                        <MoreVertical size={22} strokeWidth={2.5} />
                                    </button>

                                    {openMenu === d.id && (
                                        <div
                                            className="menu-dropdown absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-lg border"
                                            style={{
                                                width: "140px",
                                                zIndex: 50,
                                                fontSize: "15px",
                                            }}
                                        >
                                            <button
                                                onClick={() => approve(d.id)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 font-medium"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => reject(d.id)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

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
