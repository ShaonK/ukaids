"use client";

import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import { useState } from "react";

export default function DepositPage() {
    const [items] = useState([
        { user: "UserA", amount: 50, tx: "TX111", status: "pending" },
        { user: "UserB", amount: 100, tx: "TX222", status: "pending" },
    ]);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Pending Deposits</h2>

            {items.map((d, i) => (
                <Card key={i}>
                    <h3 className="font-semibold">{d.user}</h3>

                    <p className="text-sm">Amount: ${d.amount}</p>
                    <p className="text-sm text-gray-600">TX: {d.tx}</p>

                    <div className="flex gap-3 mt-3">
                        <Button label="Approve" className="bg-green-600" />
                        <Button label="Reject" className="bg-red-600" />
                    </div>
                </Card>
            ))}
        </div>
    );
}
