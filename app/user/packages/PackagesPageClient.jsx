"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PackageRow from "@/app/components/PackageRow";

export default function PackagesPageClient() {
  const router = useRouter();

  const [packages, setPackages] = useState([]);
  const [activePackage, setActivePackage] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setWallet(walletData?.wallet ?? walletData);
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
    if (!packageId) return alert("Package ID missing");

    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return alert("Package not found");

    if (!wallet || wallet.mainWallet < pkg.amount) {
      router.push("/user/mine/recharge");
      return;
    }

    try {
      const res = await fetch("/api/user/package/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data?.error || "Package purchase failed");

      alert("✅ Package activated successfully!");
      router.push("/user");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ---------------------------
  // UPGRADE PACKAGE
  // ---------------------------
  const upgradePackage = async (packageId) => {
    if (!packageId) return alert("Package ID missing");

    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return alert("Package not found");

    if (!wallet || wallet.mainWallet < pkg.amount) {
      router.push("/user/mine/recharge");
      return;
    }

    try {
      const res = await fetch("/api/user/package/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data?.error || "Upgrade failed");

      alert("🚀 Package upgraded successfully!");
      router.push("/user");
    } catch (err) {
      console.error(err);
      alert("Server error");
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
          />
        ))}
      </div>
    </div>
  );
}
