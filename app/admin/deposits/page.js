"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";

export default function AdminDepositsPage() {
    const [deposits, setDeposits] = useState([]);

    async function loadDeposits() {
        const res = await fetch("/api/admin/deposits");
        const data = await res.json();
        setDeposits(data);
    }

    // ⭐ FIXED — correct API path
    async function approve(id) {
        const res = await fetch("/api/admin/deposit/approve", {
            method: "POST",
            body: JSON.stringify({ id }),
        });

        const data = await res.json();
        if (data.success) loadDeposits();
        else alert(data.error);
    }

    async function reject(id) {
        const res = await fetch("/api/admin/deposit/reject", {
            method: "POST",
            body: JSON.stringify({ id }),
        });

        const data = await res.json();
        if (data.success) loadDeposits();
        else alert(data.error);
    }

    useEffect(() => {
        loadDeposits();
    }, []);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Deposit Requests</h1>

            {deposits.map((d) => (
                <Card key={d.id}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{d.user.username}</p>
                            <p className="text-xs">Amount: ${d.amount}</p>
                            <p className="text-xs">TRX ID: {d.trxId}</p>

                            <p className="text-xs">
                                Status:{" "}
                                <span
                                    className={
                                        d.status === "pending"
                                            ? "text-orange-600"
                                            : d.status === "approved"
                                                ? "text-green-600"
                                                : "text-red-600"
                                    }
                                >
                                    {d.status}
                                </span>
                            </p>
                        </div>

                        {d.status === "pending" && (
                            <div className="flex flex-col gap-2">
                                <button
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={() => approve(d.id)}
                                >
                                    Approve
                                </button>

                                <button
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                    onClick={() => reject(d.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}
