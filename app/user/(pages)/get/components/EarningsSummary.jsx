"use client";

import { useEffect, useState } from "react";
import { BarChart3, PieChart } from "lucide-react";

function SummaryCard({ icon: Icon, title, value, highlight = false }) {
  return (
    <div
      className={`
        rounded-xl p-[1px]
        ${highlight
          ? "bg-gradient-to-br from-orange-500 to-yellow-400"
          : "bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]"}
      `}
    >
      <div
        className="
          bg-[#121212]
          rounded-xl
          p-4
          h-[110px]
          flex flex-col items-center justify-center
          text-center
        "
      >
        <Icon
          size={34}
          className={highlight ? "text-orange-400" : "text-gray-300"}
        />

        <p className="mt-2 text-[13px] text-gray-400">
          {title}
        </p>

        <p
          className={`
            mt-1 text-[20px] font-bold
            ${highlight ? "text-orange-400" : "text-white"}
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function EarningsSummary() {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(0);
  const [balance, setBalance] = useState(0);

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
          fetch("/api/user/history/roi?limit=500"),
          fetch("/api/user/history/level?limit=500"),
          fetch("/api/user/history/referral?limit=500"),
        ]);

        const walletData = await walletRes.json();
        const roiData = await roiRes.json();
        const levelData = await levelRes.json();
        const referralData = await referralRes.json();

        if (!mounted) return;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const sumToday = (rows) =>
          rows
            .filter(r => new Date(r.createdAt) >= todayStart)
            .reduce((s, r) => s + Number(r.amount), 0);

        const todayIncome =
          sumToday(roiData.history || []) +
          sumToday(levelData.history || []) +
          sumToday(referralData.history || []);

        setToday(todayIncome);
        setBalance(Number(walletData.wallet?.mainWallet || 0));

      } catch (err) {
        console.error("EARNINGS SUMMARY ERROR:", err);
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
      <div className="w-full px-4 mt-6 text-center text-gray-500 text-sm">
        Loading summary…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 w-full px-4 mt-6">
      <SummaryCard
        icon={BarChart3}
        title="Today's Earnings"
        value={fmt(today)}
        highlight
      />

      <SummaryCard
        icon={PieChart}
        title="Account Balance"
        value={fmt(balance)}
      />
    </div>
  );
}
