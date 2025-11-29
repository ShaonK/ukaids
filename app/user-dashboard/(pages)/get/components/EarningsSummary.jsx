"use client";

import { BarChart3, PieChart } from "lucide-react";

export default function EarningsSummary({
  todayEarnings = 0,
  accountBalance = 0,
}) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full px-4 mt-6">

      <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col items-center text-white">
        <BarChart3 size={40} />
        <p className="mt-2 text-[14px]">{`Today's Earnings`}</p>
        <p className="text-[20px] font-bold mt-1">$ {todayEarnings}</p>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col items-center text-white">
        <PieChart size={40} />
        <p className="mt-2 text-[14px]">Account Balance:</p>
        <p className="text-[20px] font-bold mt-1">$ {accountBalance}</p>
      </div>

    </div>
  );
}
