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
            if (!e.target.closest(".menu-dropdown") &&
                !e.target.closest(".menu-button")
            ) {
                setOpenMenu(null);
            }
        }

        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    useEffect(() => {
        loadDeposits();
    }, []);

    function renderStatusIcon(status) {
        if (status === "approved")
            return <CheckCircle size={20} color="#059669" strokeWidth={2.5} />;
        if (status === "rejected")
            return <XCircle size={20} color="#DC2626" strokeWidth={2.5} />;
        return <Clock size={20} color="#D97706" strokeWidth={2.5} />;
    }

    function copyText(text) {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    }

    const filtered = deposits.filter((d) =>
        d.user.username.toLowerCase().includes(search.toLowerCase()) ||
        d.trxId.toString().includes(search)
    );

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-6">

            {/* PAGE TITLE */}
            <h1 className="text-2xl font-bold text-[#111827] mb-4">
                Pending Deposits
            </h1>

            {/* SEARCH BAR */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search user / trx id..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full text-sm
                               focus:ring focus:ring-blue-200 outline-none"
                />
            </div>

            {/* TABLE */}
            <div
                className="rounded-xl overflow-hidden mx-auto"
                style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    maxWidth: "100%",
                }}
            >

                {/* HEADER */}
                <div
                    className="grid px-4 py-2 border-b"
                    style={{
                        gridTemplateColumns: "1.2fr 1fr 1fr 0.6fr 0.8fr",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1F2937",
                    }}
                >
                    <span>User</span>
                    <span>Amt</span>
                    <span>TRX</span>
                    <span>Status</span>
                    <span className="text-right">Act</span>
                </div>

                {/* ROWS */}
                {paginated.map((d) => (
                    <div
                        key={d.id}
                        className="grid px-4 py-2 border-b text-sm"
                        style={{
                            gridTemplateColumns: "1.2fr 1fr 1fr 0.6fr 0.8fr",
                            alignItems: "center",
                        }}
                    >
                        {/* USER */}
                        <span className="truncate">{d.user.username}</span>

                        {/* AMOUNT */}
                        <span
                            className="truncate flex items-center gap-1 cursor-pointer"
                            onClick={() => copyText(d.amount)}
                        >
                            ${String(d.amount).slice(0, 5)}
                            {String(d.amount).length > 5 ? "…" : ""}
                        </span>

                        {/* TRX */}
                        <span className="truncate flex items-center gap-1">
                            {String(d.trxId).slice(0, 6)}
                            {String(d.trxId).length > 6 ? "…" : ""}
                            <Copy
                                size={16}
                                className="cursor-pointer"
                                onClick={() => copyText(d.trxId)}
                            />
                        </span>

                        {/* STATUS */}
                        <span className="flex justify-center">
                            {renderStatusIcon(d.status)}
                        </span>

                        {/* ACTION MENU */}
                        <div className="relative flex justify-end">

                            {d.status === "pending" && (
                                <>
                                    <button
                                        onClick={() =>
                                            setOpenMenu(openMenu === d.id ? null : d.id)
                                        }
                                        className="menu-button w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {openMenu === d.id && (
                                        <div
                                            className="menu-dropdown absolute right-0 top-0 bg-white shadow-xl rounded-lg border"
                                            style={{ width: 130, zIndex: 50 }}
                                        >
                                            <button
                                                onClick={() => approve(d.id)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => reject(d.id)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
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
            <div className="flex justify-between mt-4 text-sm">
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
