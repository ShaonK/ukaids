"use client";

import { useEffect, useState } from "react";

export default function WeeklyReportClient() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadReport() {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/reports/weekly", {
                cache: "no-store",
            });
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error("LOAD WEEKLY REPORT ERROR:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadReport();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-gray-500">
                Loading weekly report…
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6 text-red-500">
                Failed to load report
            </div>
        );
    }

    const netPositive = Number(data.netFlow) >= 0;

    return (
        <div className="min-h-screen bg-[#F5F6F8] p-5">
            {/* TITLE */}
            <div className="mb-6">
                <h1 className="text-[24px] font-bold text-[#111827]">
                    Weekly Finance Report
                </h1>
                <p className="text-sm text-gray-500">
                    {new Date(data.range.start).toLocaleDateString()} →{" "}
                    {new Date(data.range.end).toLocaleDateString()}
                </p>
            </div>

            {/* TOP CARDS */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <Card
                    title="Total Deposits"
                    value={`$${Number(
                        data.deposits.approved.total
                    ).toFixed(2)}`}
                />
                <Card
                    title="Total Withdraws"
                    value={`$${Number(
                        data.withdraws.approved.totalNet
                    ).toFixed(2)}`}
                />
                <Card
                    title="Rejected Withdraws"
                    value={`$${Number(
                        data.withdraws.rejected.total
                    ).toFixed(2)}`}
                />
                <Card
                    title="Net Flow"
                    value={`$${Number(data.netFlow).toFixed(2)}`}
                    color={netPositive ? "text-green-600" : "text-red-600"}
                />
                <Card
                    title="Withdraw Fee Collected"
                    value={`$${Number(
                        data.fees.totalCommission
                    ).toFixed(2)}`}
                />
                <Card
                    title="Pending Withdraw Requests"
                    value={data.withdraws.pending.count}
                />
            </div>

            {/* DEPOSIT SUMMARY */}
            <Section title="Deposit Summary">
                <Row
                    label="Approved Deposits"
                    value={data.deposits.approved.count}
                />
                <Row
                    label="Pending Deposits"
                    value={data.deposits.pending.count}
                    last
                />
            </Section>

            {/* WITHDRAW SUMMARY */}
            <Section title="Withdraw Summary">
                <Row
                    label="Approved Withdraws"
                    value={data.withdraws.approved.count}
                />
                <Row
                    label="Rejected Withdraws"
                    value={data.withdraws.rejected.count}
                />
                <Row
                    label="Pending Withdraw Requests"
                    value={data.withdraws.pending.count}
                    last
                />
            </Section>

            {/* FEE SUMMARY */}
            <Section title="Fee & Payout">
                <Row
                    label="Total Fee Collected"
                    value={`$${Number(
                        data.fees.totalCommission
                    ).toFixed(2)}`}
                />
                <Row
                    label="Total Paid to Users"
                    value={`$${Number(
                        data.fees.totalPaid
                    ).toFixed(2)}`}
                    last
                />
            </Section>
        </div>
    );
}

/* ---------------- UI COMPONENTS ---------------- */

function Card({ title, value, color = "text-[#111827]" }) {
    return (
        <div className="bg-white p-4 rounded-[14px] shadow-sm">
            <p className="text-[14px] font-medium text-gray-500">
                {title}
            </p>
            <p className={`text-[20px] font-bold ${color}`}>
                {value}
            </p>
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

function Row({
    label,
    value,
    last = false,
    color = "text-[#111827]",
}) {
    return (
        <div
            className={`py-2 flex justify-between text-[15px] ${last ? "" : "border-b"
                }`}
        >
            <span className="text-gray-500">{label}</span>
            <span className={`font-semibold ${color}`}>
                {value}
            </span>
        </div>
    );
}
