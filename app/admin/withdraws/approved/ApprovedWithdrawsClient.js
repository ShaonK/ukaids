"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
} from "lucide-react";

export default function ApprovedWithdrawsClient() {
    const [withdraws, setWithdraws] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PER_PAGE = 10;

    async function loadWithdraws() {
        try {
            const res = await fetch("/api/admin/withdraws/approved");
            const data = await res.json();
            setWithdraws(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("LOAD WITHDRAWS ERROR:", e);
        }
    }

    useEffect(() => {
        loadWithdraws();
    }, []);

    /* --------------------
       STATUS ICON
    -------------------- */
    function renderStatusIcon(status) {
        if (status === "APPROVED")
            return <CheckCircle size={20} color="#059669" strokeWidth={2.4} />;
        if (status === "REJECTED")
            return <XCircle size={20} color="#DC2626" strokeWidth={2.4} />;
        return <Clock size={20} color="#D97706" strokeWidth={2.4} />;
    }

    /* --------------------
       COPY
    -------------------- */
    function copyText(text) {
        navigator.clipboard.writeText(String(text));
        alert("Copied: " + text);
    }

    /* --------------------
       SEARCH + PAGINATION
    -------------------- */
    const filtered = withdraws.filter(
        (w) =>
            w.user?.username
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            String(w.trxId).includes(search)
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / PER_PAGE)
    );

    const paginated = filtered.slice(
        (page - 1) * PER_PAGE,
        page * PER_PAGE
    );

    return (
        <div className="p-6">
            {/* TITLE */}
            <h1 className="font-bold mb-4 text-[28px]">
                Approved Withdraws
            </h1>

            {/* SEARCH */}
            <div className="mb-4 px-2">
                <input
                    placeholder="Search user / trx id..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 border rounded-lg w-full focus:ring focus:ring-blue-200 outline-none"
                />
            </div>

            {/* TABLE */}
            <div
                className="rounded-xl overflow-hidden mx-auto bg-white border border-gray-200"
                style={{ maxWidth: "95%", fontSize: 13 }}
            >
                {/* HEADER */}
                <div className="grid grid-cols-5 px-4 h-10 font-semibold items-center border-b">
                    <span>User</span>
                    <span>Amt</span>
                    <span>TRX</span>
                    <span>Status</span>
                    <span className="text-right pr-4">Date</span>
                </div>

                {/* ROWS */}
                {paginated.map((w) => (
                    <div
                        key={w.id}
                        className="grid grid-cols-5 px-4 h-10 items-center border-b"
                    >
                        {/* USER */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(w.user.username)}
                        >
                            {w.user.username}
                        </span>

                        {/* AMOUNT */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(w.amount)}
                        >
                            ${w.amount}
                        </span>

                        {/* TRX */}
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(w.trxId)}
                        >
                            {String(w.trxId).slice(0, 6)}…
                        </span>

                        {/* STATUS */}
                        <span className="flex justify-center">
                            {renderStatusIcon(w.status)}
                        </span>

                        {/* DATE */}
                        <span
                            className="flex justify-end items-center gap-1 pr-4 cursor-pointer truncate"
                            title={new Date(w.createdAt).toLocaleString()}
                            onClick={() =>
                                copyText(
                                    new Date(w.createdAt).toLocaleDateString()
                                )
                            }
                        >
                            {new Date(w.createdAt)
                                .toLocaleDateString()
                                .slice(0, 6)}
                            …
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
