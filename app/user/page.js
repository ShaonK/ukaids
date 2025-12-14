"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import UserAmountSummaryCard from "./components/UserAmountSummaryCard";
import SpeakerMessage from "./components/SpeakerMessage";
import QuickActions from "./components/QuickActions";
import InviteButton from "./components/InviteButton";
import IncomeOptions from "./components/IncomeOptions";
import FeatherImage from "./components/FeatherImage";
import TaskCard from "./components/TaskCard";

export default function DashboardPage() {
  const [wallet, setWallet] = useState({
    mainWallet: 0,
    depositWallet: 0,     // ✅ FIXED
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
        if (!res.ok) return;

        const data = await res.json();

        if (mounted) {
          setWallet({
            mainWallet: data?.wallet?.mainWallet ?? 0,
            depositWallet: data?.wallet?.depositWallet ?? 0, // ✅ FIXED
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

  const fmt = (n) => {
    if (typeof n !== "number") n = Number(n) || 0;
    return n.toFixed(2) + " USD";
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-[360px] min-h-screen bg-[#121212]">

      {/* BACKGROUND */}
      <div className="absolute inset-0 h-[350px] overflow-hidden z-0">
        <Image
          src="/user-d-hero-bg.png"
          alt="Dashboard BG"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="relative z-10 pt-4 space-y-4">
        <UserAmountSummaryCard
          title="Account Balance"
          amount={fmt(wallet.mainWallet)}
        />

        <UserAmountSummaryCard
          title="Deposit Balance"
          amount={fmt(wallet.depositWallet)}
        />

        <UserAmountSummaryCard
          title="ROI Wallet"
          amount={fmt(wallet.roiWallet)}
        />

        <UserAmountSummaryCard
          title="Referral Wallet"
          amount={fmt(wallet.referralWallet)}
        />

        <UserAmountSummaryCard
          title="Level Income"
          amount={fmt(wallet.levelWallet)}
        />

        <UserAmountSummaryCard
          title="Total Earned"
          amount={fmt(
            wallet.roiWallet +
            wallet.referralWallet +
            wallet.levelWallet +
            wallet.returnWallet +
            wallet.salaryWallet
          )}
        />
      </div>

      {/* OTHER DASHBOARD SECTIONS */}
      <SpeakerMessage />
      <QuickActions />
      <InviteButton />
      <IncomeOptions />
      <FeatherImage />

      {/* TASK CARDS (UNCHANGED) */}
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
  );
}
