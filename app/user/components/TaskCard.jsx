"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TaskCard({ pkg }) {
  const router = useRouter();
  if (!pkg) return null;

  const amount = Number(pkg.amount);

  // 🔢 SYSTEM RULES
  const ROI_RATE = 0.02;        // 2% daily
  const REFERRAL_RATE = 0.10;   // direct
  const LEVEL_RATES = [0.05, 0.04, 0.03, 0.02, 0.01];

  const dailyROI = amount * ROI_RATE;
  const referralIncome = amount * REFERRAL_RATE;
  const levelIncome =
    amount * LEVEL_RATES.reduce((s, r) => s + r, 0);

  const fmt = (n) => `$${Number(n).toFixed(2)}`;

  return (
    <div
      onClick={() => router.push("/user/packages")}
      className="
        w-[320px] mx-auto mt-4
        rounded-[18px] px-4 py-3
        flex items-center
        cursor-pointer
        transition-all duration-300
        hover:scale-[1.02]
      "
      style={{
        background: "linear-gradient(145deg,#1A1A1A,#0E0E0E)",
        boxShadow:
          "0 6px 18px rgba(0,0,0,.9), inset 0 2px 4px rgba(255,255,255,.03)",
      }}
    >
      {/* ICON */}
      <div className="w-[64px] h-[64px] rounded-xl flex items-center justify-center bg-[#191919] border border-white/5">
        <Image src="/tcardimage.png" alt="task" width={42} height={42} />
      </div>

      {/* INFO */}
      <div className="flex-1 ml-3 text-[12px] text-white">
        <p className="font-semibold text-[#EC7B03]">{pkg.name}</p>
        <p>💰 Deposit: {fmt(amount)}</p>
        <p>📈 Daily ROI: {fmt(dailyROI)}</p>
      </div>

      {/* TAG */}
      <div className="text-[11px] font-bold px-3 py-1 rounded-lg text-white
        bg-gradient-to-b from-[#FFD08A] to-[#8B6A46]">
        ACTIVE
      </div>
    </div>
  );
}
