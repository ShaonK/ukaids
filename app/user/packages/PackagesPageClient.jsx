"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PackageRow from "@/app/components/PackageRow";

export default function PackagesPageClient() {
  const router = useRouter();

  const [packages, setPackages] = useState([]);
  const [activePackage, setActivePackage] = useState(null);
  const [wallet, setWallet] = useState({ mainWallet: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ---------------------------
  // LOAD DATA
  // ---------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const [pkgRes, activeRes, walletRes] = await Promise.all([
          fetch("/api/packages", { cache: "no-store" }),
          fetch("/api/user/active-package", { cache: "no-store" }),
          fetch("/api/user/wallet", { cache: "no-store" }),
        ]);

        const pkgData = await pkgRes.json();
        const activeData = activeRes.ok ? await activeRes.json() : null;
        const walletData = await walletRes.json();

        setPackages(Array.isArray(pkgData) ? pkgData : []);
        setActivePackage(activeData);

        // ✅ NORMALIZE WALLET
        const w = walletData?.wallet ?? walletData ?? {};
        setWallet({
          mainWallet: Number(w.mainWallet) || 0,
        });

      } catch (e) {
        console.error("FAILED TO LOAD PACKAGES:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ---------------------------
  // BUY PACKAGE
  // ---------------------------
  const buyPackage = async (packageId) => {
    if (processing) return;
    setProcessing(true);

    try {
      const pkg = packages.find((p) => p.id === packageId);
      if (!pkg) {
        alert("Package not found");
        return;
      }

      const price = Number(pkg.amount) || 0;
      const balance = Number(wallet.mainWallet) || 0;

      // ✅ ONLY BALANCE CHECK (FIRST PACKAGE SAFE)
      if (balance < price) {
        router.push("/user/mine/recharge");
        return;
      }

      const res = await fetch("/api/user/package/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Package purchase failed");
        return;
      }

      alert("✅ Package activated successfully!");
      router.push("/user");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setProcessing(false);
    }
  };

  // ---------------------------
  // UPGRADE PACKAGE
  // ---------------------------
  const upgradePackage = async (packageId) => {
    if (processing) return;
    setProcessing(true);

    try {
      const pkg = packages.find((p) => p.id === packageId);
      if (!pkg) {
        alert("Package not found");
        return;
      }

      const price = Number(pkg.amount) || 0;
      const balance = Number(wallet.mainWallet) || 0;

      if (balance < price) {
        router.push("/user/mine/recharge");
        return;
      }

      const res = await fetch("/api/user/package/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Upgrade failed");
        return;
      }

      alert("🚀 Package upgraded successfully!");
      router.push("/user");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setProcessing(false);
    }
  };

  // ---------------------------
  // LOADING
  // ---------------------------
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading packages…
      </div>
    );
  }

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-white mb-4">
        Packages
      </h1>

      <div className="space-y-3">
        {packages.map((pkg) => (
          <PackageRow
            key={pkg.id}
            pkg={pkg}
            packages={packages}
            activePackage={activePackage}
            onBuy={buyPackage}
            onUpgrade={upgradePackage}
            disabled={processing}
          />
        ))}
      </div>
    </div>
  );
}
