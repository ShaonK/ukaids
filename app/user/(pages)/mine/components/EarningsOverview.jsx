"use client";

import { useEffect, useState } from "react";

function StatCard({ title, value, highlight = false }) {
  return (
    <div
      className={`
        rounded-xl p-[1px]
        ${highlight
          ? "bg-gradient-to-br from-orange-500 to-yellow-400"
          : "bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a]"}
      `}
    >
      <div
        className="
          bg-[#121212]/95
          rounded-xl
          px-3 py-3
          h-[76px]
          flex flex-col justify-center
        "
      >
        <p className="text-[11px] text-gray-400 leading-tight">
          {title}
        </p>

        <p
          className={`
            mt-1 text-[17px] font-bold tracking-wide
            ${highlight ? "text-orange-400" : "text-white"}
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function EarningsOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0,
    referralToday: 0,
    levelMonth: 0,
    deposit: 0,
    total: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [
          walletRes,
          roiRes,
          levelRes,
          referralRes,
        ] = await Promise.all([
          fetch("/api/user/wallet", { cache: "no-store" }),
          fetch("/api/user/history/roi?limit=1000"),
          fetch("/api/user/history/level?limit=1000"),
          fetch("/api/user/history/referral?limit=1000"),
        ]);

        const walletData = await walletRes.json();
        const roiData = await roiRes.json();
        const levelData = await levelRes.json();
        const referralData = await referralRes.json();

        if (!mounted) return;

        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const week = new Date();
        week.setDate(week.getDate() - week.getDay());
        week.setHours(0, 0, 0, 0);

        const month = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );

        const sum = (rows, from, to = null) =>
          rows
            .filter(r => {
              const d = new Date(r.createdAt);
              return d >= from && (!to || d < to);
            })
            .reduce((s, r) => s + Number(r.amount), 0);

        const roi = roiData.history || [];
        const level = levelData.history || [];
        const referral = referralData.history || [];

        setStats({
          today: sum(roi, today) + sum(level, today) + sum(referral, today),
          yesterday:
            sum(roi, yesterday, today) +
            sum(level, yesterday, today) +
            sum(referral, yesterday, today),
          week: sum(roi, week) + sum(level, week) + sum(referral, week),
          month: sum(roi, month) + sum(level, month) + sum(referral, month),
          referralToday: sum(referral, today),
          levelMonth: sum(level, month),
          deposit: Number(walletData.wallet?.depositWallet || 0),
          total:
            roi.reduce((s, r) => s + Number(r.amount), 0) +
            level.reduce((s, r) => s + Number(r.amount), 0) +
            referral.reduce((s, r) => s + Number(r.amount), 0),
        });
      } catch (e) {
        console.error("EARNINGS OVERVIEW ERROR:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => (mounted = false);
  }, []);

  const fmt = (n) => `$${Number(n).toFixed(2)}`;

  if (loading) {
    return (
      <div className="mt-6 text-center text-gray-500 text-sm">
        Loading earnings overview…
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5">

      {/* 🔥 Highlight row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Today's Earnings"
          value={fmt(stats.today)}
          highlight
        />
        <StatCard
          title="Total Revenue"
          value={fmt(stats.total)}
          highlight
        />
      </div>

      {/* Regular stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Yesterday" value={fmt(stats.yesterday)} />
        <StatCard title="This Week" value={fmt(stats.week)} />
        <StatCard title="This Month" value={fmt(stats.month)} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="Referral Income (Today)"
          value={fmt(stats.referralToday)}
        />
        <StatCard
          title="Team Task Income"
          value={fmt(stats.levelMonth)}
        />
        <StatCard
          title="Security Deposit"
          value={fmt(stats.deposit)}
        />
      </div>
    </div>
  );
}
