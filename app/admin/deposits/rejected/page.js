"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";

export default function RejectedDepositsPage() {
    const [list, setList] = useState([]);

    async function loadData() {
        const res = await fetch("/api/admin/deposits/rejected");
        const data = await res.json();
        setList(data);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Rejected Deposits</h1>

            {list.map((d) => (
                <Card key={d.id}>
                    <p>User ID: {d.userId}</p>
                    <p>Amount: ${d.amount}</p>
                    <p>TRX: {d.trxId}</p>
                    <p>Date: {new Date(d.createdAt).toLocaleString()}</p>
                </Card>
            ))}
        </div>
    );
}
