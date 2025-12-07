"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        referrals: 0,
        earnings: 0,
        withdrawRequests: 0,
        activeDeposits: 0,
        pendingDeposits: 0,
        totalWithdraws: 0,
        newUsersToday: 0,
        newUsersWeek: 0,
        newUsersMonth: 0,
        referralClicks: 0,
        conversionRate: 0
    });

    async function loadStats() {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setStats(data);
    }

    useEffect(() => {
        loadStats();
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F6F8] p-5">

            {/* TITLE */}
            <h1 className="text-[24px] font-bold text-[#111827] mb-5">
                Dashboard
            </h1>

            {/* TOP CARDS */}
            <div className="grid grid-cols-2 gap-3 mb-6">

                <Card title="Total Users" value={stats.users} />

                <Card title="Total Referrals" value={stats.referrals} />

                <Card title="Total Earnings" value={`$${stats.earnings}`} />

                <Card title="Withdraw Requests" value={stats.withdrawRequests} />

                <Card title="Active Deposits" value={stats.activeDeposits} />

                <Card title="Pending Deposits" value={stats.pendingDeposits} />

                <Card title="Total Withdraws" value={stats.totalWithdraws} />
            </div>

            {/* USER STATISTICS */}
            <Section title="User Statistics">
                <Row label="New Users Today" value={stats.newUsersToday} />
                <Row label="New Users This Week" value={stats.newUsersWeek} />
                <Row label="New Users This Month" value={stats.newUsersMonth} last />
            </Section>

            {/* REFERRAL PERFORMANCE */}
            <Section title="Referral Performance">
                <Row label="Referral Clicks" value={stats.referralClicks} />
                <Row
                    label="Conversion Rate"
                    value={`${stats.conversionRate}%`}
                    color="text-[#059669]"
                    last
                />
            </Section>
        </div>
    );
}

/* COMPONENTS */
function Card({ title, value }) {
    return (
        <div className="bg-white p-4 rounded-[14px] shadow-sm">
            <p className="text-[14px] font-medium text-gray-500">{title}</p>
            <p className="text-[20px] font-bold text-[#111827]">{value}</p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-[14px] p-4 mb-6 shadow-sm">
            <h2 className="text-[18px] font-semibold mb-3 text-[#111827]">
                {title}
            </h2>

            {children}
        </div>
    );
}

function Row({ label, value, last = false, color = "text-[#111827]" }) {
    return (
        <div
            className={`py-2 flex justify-between text-[15px] ${
                last ? "" : "border-b"
            }`}
        >
            <span className="text-gray-500">{label}</span>
            <span className={`font-semibold ${color}`}>{value}</span>
        </div>
    );
}
