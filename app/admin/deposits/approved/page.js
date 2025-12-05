"use client";

import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";

export default function ApprovedDepositsPage() {
    const [list, setList] = useState([]);

    async function loadData() {
        const res = await fetch("/api/admin/deposits/approved");
        const data = await res.json();
        setList(data || []);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Approved Deposits</h1>

            <div className="space-y-6">
                {list.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                        {/* Top User Section */}
                        <div className="flex items-center gap-4 p-5">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <UserCircle size={40} className="text-blue-600" />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold capitalize text-gray-800">
                                    {item.user.fullname}
                                </h2>
                                <p className="text-blue-600 text-sm">@{item.user.username}</p>
                            </div>
                        </div>

                        {/* Bottom Blue Section */}
                        <div className="flex">
                            {/* Amount */}
                            <div className="w-1/2 bg-blue-500 text-white p-5">
                                <p className="text-sm opacity-90">Amount</p>
                                <p className="text-2xl font-bold mt-1">${item.amount}</p>
                            </div>

                            {/* Transaction ID */}
                            <div className="w-1/2 bg-blue-600 text-white p-5">
                                <p className="text-sm opacity-90">Transaction ID</p>
                                <p className="text-2xl font-bold mt-1">{item.trxId}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
