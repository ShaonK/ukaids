"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

import UserAmountSummaryCard from "./components/UserAmountSummaryCard";
import SpeakerMessage from "./components/SpeakerMessage";
import QuickActions from "./components/QuickActions";
import InviteButton from "./components/InviteButton";
import IncomeOptions from "./components/IncomeOptions";
import FeatherImage from "./components/FeatherImage";

export default function DashboardClient() {
  const [wallet, setWallet] = useState({
    mainWallet: 0,
    roiWallet: 0,
    referralWallet: 0,
    levelWallet: 0,
    returnWallet: 0,
    salaryWallet: 0,
    donationWallet: 0,
  });

  const [activePackageAmount, setActivePackageAmount] = useState(0);

  const [lifetimeIncome, setLifetimeIncome] = useState({
    roi: 0,
    level: 0,
    referral: 0,
  });

  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD WALLET
  ========================= */
  useEffect(() => {
    let mounted = true;

    async function loadWallet() {
      try {
        const res = await fetch("/api/user/wallet", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!mounted || !data?.wallet) return;

        setWallet({
          mainWallet: Number(data.wallet.mainWallet || 0),
          roiWallet: Number(data.wallet.roiWallet || 0),
          referralWallet: Number(data.wallet.referralWallet || 0),
          levelWallet: Number(data.wallet.levelWallet || 0),
          returnWallet: Number(data.wallet.returnWallet || 0),
          salaryWallet: Number(data.wallet.salaryWallet || 0),
          donationWallet: Number(data.wallet.donationWallet || 0),
        });
      } catch (err) {
        console.error("Wallet load error:", err);
      }
    }

    loadWallet();
    return () => (mounted = false);
  }, []);

  /* =========================
     LOAD ACTIVE PACKAGE
  ========================= */
  useEffect(() => {
    async function loadActivePackage() {
      try {
        const res = await fetch("/api/user/active-package", {
          cache: "no-store",
        });
        if (!res.ok) {
          setActivePackageAmount(0);
          return;
        }

        const data = await res.json();
        setActivePackageAmount(Number(data?.amount || 0));
      } catch (err) {
        console.error("Active package load error:", err);
        setActivePackageAmount(0);
      } finally {
        setLoading(false);
      }
    }

    loadActivePackage();
  }, []);

  /* =========================
     LOAD LIFETIME INCOME
  ========================= */
  useEffect(() => {
    async function loadIncome() {
      try {
        const res = await fetch("/api/user/income-summary", {
          cache: "no-store",
        });
        if (!res.ok) return;

        const data = await res.json();
        setLifetimeIncome({
          roi: Number(data.roi || 0),
          level: Number(data.level || 0),
          referral: Number(data.referral || 0),
        });
      } catch (err) {
        console.error("Income load error:", err);
      }
    }
    loadIncome();
  }, []);

  const fmt = (n) => Number(n).toFixed(2) + " USD";

  const totalIncome = useMemo(() => {
    return lifetimeIncome.roi + lifetimeIncome.level + lifetimeIncome.referral;
  }, [lifetimeIncome]);

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
      <div className="absolute inset-0 h-[350px] z-0">
        <Image
          src="/user-d-hero-bg.png"
          alt="Dashboard BG"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* WALLET CARDS */}
      <div className="relative z-10 pt-6 space-y-4">
        <UserAmountSummaryCard
          title="Account Balance"
          amount={fmt(wallet.mainWallet)}
        />

        {/* ✅ ACTIVE PACKAGE ONLY */}
        <UserAmountSummaryCard
          title="Deposit Balance"
          amount={fmt(activePackageAmount)}
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
          title="Level Wallet"
          amount={fmt(wallet.levelWallet)}
        />

        <UserAmountSummaryCard
          title="Rank Salary Wallet"
          amount={fmt(wallet.salaryWallet)}
        />

        <UserAmountSummaryCard
          title="Gift Wallet"
          amount={fmt(wallet.donationWallet)}
        />

        <UserAmountSummaryCard
          title="Return Wallet"
          amount={fmt(wallet.returnWallet)}
        />

        <UserAmountSummaryCard
          title="Total Income (Lifetime)"
          amount={fmt(totalIncome)}
        />
      </div>

      {/* OTHER SECTIONS */}
      <SpeakerMessage />
      <QuickActions />
      <InviteButton />
      <IncomeOptions />
      <FeatherImage />
    </div>
  );
}
