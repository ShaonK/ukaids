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
    } catch (err) {
      console.error("LOAD WEEKLY REPORT ERROR:", err);
      setData(null);
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

  if (!data || data.error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load weekly report
      </div>
    );
  }

  /* ================= SAFE DESTRUCTURE ================= */
  const {
    range = {},
    deposits = { count: 0, total: 0 },
    withdraws = { count: 0, total: 0, fee: 0 },
    pending = { withdraws: 0, deposits: 0 },
    totals = { netFlow: 0 },
  } = data;

  const netFlow = Number(totals.netFlow || 0);
  const netPositive = netFlow >= 0;

  return (
    <div className="min-h-screen bg-[#F5F6F8] p-5">
      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#111827]">
          Weekly Financial Report
        </h1>
        <p className="text-sm text-gray-500">
          {range.start
            ? `${new Date(range.start).toLocaleDateString()} → ${new Date(
                range.end
              ).toLocaleDateString()}`
            : "Date range unavailable"}
        </p>
      </div>

      {/* ================= TOP CARDS ================= */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card
          title="Total Deposits"
          value={`$${Number(deposits.total).toFixed(2)}`}
        />

        <Card
          title="Total Withdraws"
          value={`$${Number(withdraws.total).toFixed(2)}`}
        />

        <Card
          title="Withdraw Fees Collected"
          value={`$${Number(withdraws.fee).toFixed(2)}`}
        />

        <Card
          title="Net Flow"
          value={`$${netFlow.toFixed(2)}`}
          color={netPositive ? "text-green-600" : "text-red-600"}
        />
      </div>

      {/* ================= DEPOSIT SUMMARY ================= */}
      <Section title="Deposit Summary">
        <Row
          label="Approved Deposits"
          value={deposits.count}
        />
        <Row
          label="Total Deposit Amount"
          value={`$${Number(deposits.total).toFixed(2)}`}
        />
        <Row
          label="Pending Deposits"
          value={pending.deposits}
          last
        />
      </Section>

      {/* ================= WITHDRAW SUMMARY ================= */}
      <Section title="Withdraw Summary">
        <Row
          label="Approved Withdraws"
          value={withdraws.count}
        />
        <Row
          label="Total Withdraw Amount"
          value={`$${Number(withdraws.total).toFixed(2)}`}
        />
        <Row
          label="Pending Withdraw Requests"
          value={pending.withdraws}
          last
        />
      </Section>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

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
      className={`py-2 flex justify-between text-[15px] ${
        last ? "" : "border-b"
      }`}
    >
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${color}`}>
        {value}
      </span>
    </div>
  );
}
