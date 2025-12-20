"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

import UserAmountSummaryCard from "./components/UserAmountSummaryCard";
import SpeakerMessage from "./components/SpeakerMessage";
import QuickActions from "./components/QuickActions";
import InviteButton from "./components/InviteButton";
import IncomeOptions from "./components/IncomeOptions";
import FeatherImage from "./components/FeatherImage";
import TaskCard from "./components/TaskCard";

export default function DashboardClient() {
  const [wallet, setWallet] = useState({
    mainWallet: 0,
    depositWallet: 0,
    roiWallet: 0,
    referralWallet: 0,
    levelWallet: 0,
    returnWallet: 0,
    salaryWallet: 0,
    donationWallet: 0,
  });

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load wallet
  // =========================
  useEffect(() => {
    let mounted = true;

    async function loadWallet() {
      try {
        const res = await fetch("/api/user/wallet", {
          cache: "no-store",
        });
        if (!res.ok) return;

        const data = await res.json();

        if (mounted) {
          setWallet({
            mainWallet: Number(data?.wallet?.mainWallet) || 0,
            depositWallet: Number(data?.wallet?.depositWallet) || 0,
            roiWallet: Number(data?.wallet?.roiWallet) || 0,
            referralWallet: Number(data?.wallet?.referralWallet) || 0,
            levelWallet: Number(data?.wallet?.levelWallet) || 0,
            returnWallet: Number(data?.wallet?.returnWallet) || 0,
            salaryWallet: Number(data?.wallet?.salaryWallet) || 0,
            donationWallet: Number(data?.wallet?.donationWallet) || 0,
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

  // =========================
  // Load packages (NEW)
  // =========================
  useEffect(() => {
    async function loadPackages() {
      try {
        const res = await fetch("/api/packages", {
          cache: "no-store",
        });
        const data = await res.json();
        setPackages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load packages:", err);
      }
    }

    loadPackages();
  }, []);

  // =========================
  // Format
  // =========================
  const fmt = (n) => Number(n).toFixed(2) + " USD";

  // =========================
  // TOTAL INCOME (ONLY)
  // ROI + LEVEL + REFERRAL
  // =========================
  const totalIncome = useMemo(() => {
    return wallet.roiWallet + wallet.levelWallet + wallet.referralWallet;
  }, [wallet.roiWallet, wallet.levelWallet, wallet.referralWallet]);

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
        <div className="absolute inset-0 bg-black/80" />
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
          title="ROI Income"
          amount={fmt(wallet.roiWallet)}
        />

        <UserAmountSummaryCard
          title="Referral Income"
          amount={fmt(wallet.referralWallet)}
        />

        <UserAmountSummaryCard
          title="Level Income"
          amount={fmt(wallet.levelWallet)}
        />

        <UserAmountSummaryCard
          title="Total Income"
          amount={fmt(totalIncome)}
        />

        <UserAmountSummaryCard
          title="Donation Wallet"
          amount={fmt(wallet.donationWallet)}
        />

        <UserAmountSummaryCard
          title="Return Wallet"
          amount={fmt(wallet.returnWallet)}
        />
      </div>

      {/* OTHER SECTIONS */}
      <SpeakerMessage />
      <QuickActions />
      <InviteButton />
      <IncomeOptions />
      <FeatherImage />

      {/* 🔥 TASK CARDS (ONLY THIS PART CHANGED) */}
      <div className="pb-6">
        {packages.map((pkg) => (
          <TaskCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
