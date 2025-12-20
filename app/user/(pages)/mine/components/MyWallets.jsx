"use client";

import { useEffect, useState } from "react";

export default function MyWallets() {
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [returnWallet, setReturnWallet] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadWallet() {
      try {
        const res = await fetch("/api/user/wallet", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();
        const wallet = data?.wallet;

        if (!wallet || !mounted) return;

        const totalIncome =
          Number(wallet.roiWallet || 0) +
          Number(wallet.levelWallet || 0) +
          Number(wallet.referralWallet || 0);

        setIncome(totalIncome);
        setReturnWallet(Number(wallet.returnWallet || 0));
      } catch (err) {
        console.error("MY WALLETS LOAD ERROR:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWallet();
    return () => {
      mounted = false;
    };
  }, []);

  const fmt = (n) => Number(n).toFixed(2) + " USD";

  if (loading) {
    return (
      <div className="w-full mt-4 flex justify-center">
        <div className="w-[360px] rounded-lg bg-[#1A1A1A] px-4 py-3 text-center text-gray-400">
          Loading wallets…
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 flex justify-center">
      {/* Gradient Border Box */}
      <div className="w-[360px] rounded-lg p-[1px] bg-[linear-gradient(90deg,#EC7B03,#3B82F6)]">
        {/* Inner Box */}
        <div className="bg-[#121212] rounded-lg flex justify-between px-4 py-2">
          {/* Total Income Wallet */}
          <div className="flex flex-col">
            <span className="text-white text-[14px] font-semibold">
              Total Income Wallet
            </span>
            <span className="text-[#E07503] text-[16px] font-bold">
              {fmt(income)}
            </span>
          </div>

          {/* Return Wallet */}
          <div className="flex flex-col text-right">
            <span className="text-white text-[14px] font-semibold">
              Return Wallet
            </span>
            <span className="text-[#E07503] text-[16px] font-bold">
              {fmt(returnWallet)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
