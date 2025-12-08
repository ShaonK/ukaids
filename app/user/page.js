"use client";

import { useEffect, useState } from "react";
import DashboardCard from "./components/DashboardCard";
import FeatherImage from "./components/FeatherImage";
import IncomeOptions from "./components/IncomeOptions";
import InviteButton from "./components/InviteButton";
import QuickActions from "./components/QuickActions";
import SpeakerMessage from "./components/SpeakerMessage";
import TaskCard from "./components/TaskCard";
import UserAmountSummaryCard from "./components/UserAmountSummaryCard";
import Image from "next/image";

export default function DashboardPage() {
  const [wallet, setWallet] = useState({
    mainWallet: 0,
    roiWallet: 0,
    referralWallet: 0,
    levelWallet: 0,
    returnWallet: 0,
    salaryWallet: 0,
    donationWallet: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadWallet() {
      try {
        const res = await fetch("/api/user/wallet");
        if (!res.ok) {
          // fallback: keep defaults
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (mounted) {
          // Expect structure: { wallet: { mainWallet, roiWallet, referralWallet, ... } }
          setWallet({
            mainWallet: data?.wallet?.mainWallet ?? 0,
            roiWallet: data?.wallet?.roiWallet ?? 0,
            referralWallet: data?.wallet?.referralWallet ?? 0,
            levelWallet: data?.wallet?.levelWallet ?? 0,
            returnWallet: data?.wallet?.returnWallet ?? 0,
            salaryWallet: data?.wallet?.salaryWallet ?? 0,
            donationWallet: data?.wallet?.donationWallet ?? 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadWallet();
    return () => {
      mounted = false;
    };
  }, []);

  // Format numbers to 2 decimal places + currency label
  const fmt = (n) => {
    if (typeof n !== "number") n = Number(n) || 0;
    return n.toFixed(2) + " USD";
  };

  return (
    <>
      <div>
        <div className="relative mx-auto w-[360px] min-h-screen bg-[#121212]">
          {/* BG IMAGE */}
          <div className="absolute inset-0 w-[360px] h-[350px] rounded-[8px] overflow-hidden z-0">
            <Image
              src="/user-d-hero-bg.png"
              alt="Dashboard BG"
              fill
              className="object-cover rounded-[8px]"
              priority
            />
            <div className="absolute inset-0 bg-[#000000CC] rounded-[8px]"></div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="relative z-10 pt-3 space-y-4">
            <UserAmountSummaryCard
              title="Account Balance"
              amount={fmt(wallet.mainWallet)}
            />
            <UserAmountSummaryCard
              title="Income Balance"
              amount={fmt(wallet.roiWallet)}
            />
            <UserAmountSummaryCard
              title="Referral Balance"
              amount={fmt(wallet.referralWallet)}
            />
            <UserAmountSummaryCard
              title="Total Earned"
              amount={fmt(
                (wallet.roiWallet || 0) +
                (wallet.referralWallet || 0) +
                (wallet.returnWallet || 0) +
                (wallet.salaryWallet || 0)
              )}
            />
          </div>

          <SpeakerMessage />
          <QuickActions />
          <InviteButton />
          <IncomeOptions />
          <FeatherImage />

          <TaskCard
            tag="A1"
            icon="/tcardimage.png"
            order="16.00 / Each Order"
            tasks="Daily Tasks : 01"
            deposit="Deposit : 25.00$"
          />

          <TaskCard
            tag="A2"
            icon="/tcardimage.png"
            order="16.00 / Each Order"
            tasks="Daily Tasks : 02"
            deposit="Deposit : 75.00$"
          />

          <TaskCard
            tag="A3"
            icon="/tcardimage.png"
            order="16.00 / Each Order"
            tasks="Daily Tasks : 03"
            deposit="Deposit : 125.00$"
          />
        </div>
      </div>
    </>
  );
}
