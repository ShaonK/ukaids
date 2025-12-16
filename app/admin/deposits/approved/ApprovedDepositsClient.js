"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function ApprovedDepositsClient() {
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

    function renderStatusIcon(status) {
        if (status === "approved")
            return <CheckCircle size={18} color="#059669" strokeWidth={2.5} />;
        if (status === "rejected")
            return <XCircle size={18} color="#DC2626" strokeWidth={2.5} />;
        return <Clock size={18} color="#D97706" strokeWidth={2.5} />;
    }

    function copyText(txt) {
        navigator.clipboard.writeText(String(txt));
        alert("Copied: " + txt);
    }

    const filtered = deposits.filter(
        (d) =>
            d.user.username.toLowerCase().includes(search.toLowerCase()) ||
            d.trxId.toString().includes(search)
    );

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-4">
            <h1 className="text-[24px] font-bold mb-4">
                Approved Deposits
            </h1>

            <input
                placeholder="Search user / trx id..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                className="w-full px-4 py-2 border rounded-lg mb-4 text-sm"
            />

            <div className="rounded-xl bg-white border mx-auto w-full">
                <div
                    className="grid grid-cols-4 px-3 border-b font-semibold text-sm"
                    style={{ height: 40, alignItems: "center" }}
                >
                    <span>User</span>
                    <span>Amount</span>
                    <span>TRX</span>
                    <span className="text-center">Status</span>
                </div>

                {paginated.map((d) => (
                    <div
                        key={d.id}
                        className="grid grid-cols-4 px-3 border-b text-sm"
                        style={{ height: 36, alignItems: "center" }}
                    >
                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(d.user.username)}
                        >
                            {d.user.username}
                        </span>

                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(d.amount)}
                        >
                            ${d.amount}
                        </span>

                        <span
                            className="truncate cursor-pointer"
                            onClick={() => copyText(d.trxId)}
                        >
                            {String(d.trxId).slice(0, 6)}…
                        </span>

                        <span className="flex justify-center">
                            {renderStatusIcon(d.status)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-4 text-sm">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                >
                    Previous
                </button>

                <span>
                    Page {page} / {totalPages || 1}
                </span>

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
