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

    async function updateDeposit(id, newStatus) {
        await fetch("/api/admin/deposit-update", {
            method: "POST",
            body: JSON.stringify({ id, status: newStatus }),
        });

        loadDeposits();
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
                            <p className="text-sm">{d.user.mobile}</p>
                            <p className="text-xs text-gray-500">
                                Amount: ${d.amount}
                            </p>
                            <p className="text-xs">
                                TRX: {d.trxId}
                            </p>
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

                        <div className="flex flex-col gap-2">
                            <button
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                                onClick={() => updateDeposit(d.id, "approved")}
                            >
                                Approve
                            </button>

                            <button
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                onClick={() => updateDeposit(d.id, "rejected")}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
