"use client";

import { useState } from "react";
import Card from "@/app/components/Card";

export default function TeamPage() {
    const [open, setOpen] = useState(null);

    const team = [
        { name: "UserA", level: 1, deposit: 50, income: 5 },
        { name: "UserB", level: 2, deposit: 100, income: 3 },
        { name: "UserC", level: 3, deposit: 500, income: 2 },
    ];

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800">Your Team</h2>

            {team.map((m, index) => (
                <Card key={index}>
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setOpen(open === index ? null : index)}
                    >
                        <div>
                            <h3 className="font-semibold">{m.name}</h3>
                            <p className="text-xs text-gray-500">Level {m.level}</p>
                        </div>

                        <span className="text-lg">{open === index ? "-" : "+"}</span>
                    </div>

                    {open === index && (
                        <div className="mt-3 border-t pt-3 text-sm text-gray-600">
                            <p>Deposit: ${m.deposit}</p>
                            <p>Income Earned: ${m.income}</p>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
