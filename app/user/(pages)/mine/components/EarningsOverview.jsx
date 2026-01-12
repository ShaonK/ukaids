"use client";

import { useEffect, useState } from "react";

/* 🔥 PREMIUM STAT CARD – CENTER ALIGNED */
function StatCard({ title, value }) {
  return (
    <div
      className="
        rounded-xl p-[1px]
        bg-gradient-to-br from-orange-500 to-yellow-400
        shadow-[0_0_12px_rgba(236,123,3,0.35)]
      "
    >
      <div
        className="
          bg-gradient-to-br from-[#1f1a12] to-[#121212]
          rounded-xl
          px-4 py-3
          h-[80px]
          flex flex-col items-center justify-center
          text-center
        "
      >
        <p className="text-[12px] text-gray-300 tracking-wide">
          {title}
        </p>

        <p className="mt-1 text-[18px] font-bold text-orange-400">
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

        const week = new Date(today);
        week.setDate(week.getDate() - week.getDay());

        const month = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

        const sum = (rows, from, to = null) =>
          rows
            .filter((r) => {
              const d = new Date(r.createdAt);
              return d >= from && (!to || d < to);
            })
            .reduce((s, r) => s + Number(r.amount), 0);

        const roi = roiData.history || [];
        const level = levelData.history || [];
        const referral = referralData.history || [];

        const todayIncome =
          sum(roi, today) + sum(level, today) + sum(referral, today);

        const yesterdayIncome =
          sum(roi, yesterday, today) +
          sum(level, yesterday, today) +
          sum(referral, yesterday, today);

        const weekIncome =
          sum(roi, week) + sum(level, week) + sum(referral, week);

        const monthIncome =
          sum(roi, month) + sum(level, month) + sum(referral, month);

        const totalIncome =
          roi.reduce((s, r) => s + Number(r.amount), 0) +
          level.reduce((s, r) => s + Number(r.amount), 0) +
          referral.reduce((s, r) => s + Number(r.amount), 0);

        setStats({
          today: todayIncome,
          yesterday: yesterdayIncome,
          week: weekIncome,
          month: monthIncome,
          deposit: Number(walletData.wallet?.depositWallet || 0),
          total: totalIncome,
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
      {/* 🔥 TOP ROW */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard title="Today's Earnings" value={fmt(stats.today)} />
        <StatCard title="Total Revenue" value={fmt(stats.total)} />
      </div>

      {/* 🔥 SECOND ROW (4 CARDS) */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Yesterday" value={fmt(stats.yesterday)} />
        <StatCard title="This Week" value={fmt(stats.week)} />
        <StatCard title="This Month" value={fmt(stats.month)} />
        <StatCard title="Security Deposit" value={fmt(stats.deposit)} />
      </div>
    </div>
  );
}
