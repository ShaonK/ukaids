"use client";

import { useEffect, useState } from "react";

export default function AdminDashboardClient() {
  const [stats, setStats] = useState({
    users: 0,
    referrals: 0,

    // ✅ NEW
    totalPackagePurchaseAmount: 0,

    earnings: 0,
    withdrawRequests: 0,
    activeDeposits: 0,
    pendingDeposits: 0,
    totalWithdraws: 0,
    totalWithdrawAmount: 0,
    newUsersToday: 0,
    newUsersWeek: 0,
    newUsersMonth: 0,
    referralClicks: 0,
    conversionRate: 0,
  });

  async function loadStats() {
    try {
      const res = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error("LOAD DASHBOARD ERROR:", e);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6F8] p-5">
      {/* TITLE */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[24px] font-bold text-[#111827]">
          Dashboard
        </h1>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card title="Total Users" value={stats.users} />
        <Card title="Total Referrals" value={stats.referrals} />

        {/* ✅ NEW CARD */}
        <Card
          title="Total Package Purchased"
          value={`$${Number(
            stats.totalPackagePurchaseAmount
          ).toFixed(2)}`}
        />

        <Card
          title="Total Earnings"
          value={`$${Number(stats.earnings).toFixed(2)}`}
        />

        <Card
          title="Withdraw Requests"
          value={stats.withdrawRequests}
        />

        <Card title="Active Deposits" value={stats.activeDeposits} />

        <Card
          title="Pending Deposits"
          value={stats.pendingDeposits}
        />

        <Card
          title="Total Withdraws"
          value={stats.totalWithdraws}
        />

        <Card
          title="Total Withdraw Given"
          value={`$${Number(
            stats.totalWithdrawAmount
          ).toFixed(2)}`}
        />
      </div>

      {/* USER STATISTICS */}
      <Section title="User Statistics">
        <Row label="New Users Today" value={stats.newUsersToday} />
        <Row
          label="New Users This Week"
          value={stats.newUsersWeek}
        />
        <Row
          label="New Users This Month"
          value={stats.newUsersMonth}
          last
        />
      </Section>

      {/* REFERRAL PERFORMANCE */}
      <Section title="Referral Performance">
        <Row
          label="Referral ClickClicks"
          value={stats.referralClicks}
        />
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

/* --------------------
   UI COMPONENTS
-------------------- */
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-[14px] shadow-sm">
      <p className="text-[14px] font-medium text-gray-500">
        {title}
      </p>
      <p className="text-[20px] font-bold text-[#111827]">
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

function Row({ label, value, last = false, color = "text-[#111827]" }) {
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
