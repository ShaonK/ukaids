"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PackageRow from "@/app/components/PackageRow";

export default function PackagesPage() {
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
          fetch("/api/packages"),
          fetch("/api/user/active-package"),
          fetch("/api/user/wallet"),
        ]);

        const pkgData = await pkgRes.json();
        const activeData = activeRes.ok ? await activeRes.json() : null;
        const walletData = await walletRes.json();

        setPackages(Array.isArray(pkgData) ? pkgData : []);
        setActivePackage(activeData);
        setWallet(walletData?.wallet ?? walletData);
      } catch (e) {
        console.error("Failed to load packages:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ---------------------------
  // BUY PACKAGE (ID based)
  // ---------------------------
  const buyPackage = async (packageId) => {
    if (!packageId) {
      alert("Package ID missing");
      return;
    }

    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) {
      alert("Package not found");
      return;
    }

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

      if (!res.ok) {
        alert(data?.error || "Package purchase failed");
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ---------------------------
  // UPGRADE PACKAGE (ID based)
  // ---------------------------
  const upgradePackage = async (packageId) => {
    if (!packageId) {
      alert("Package ID missing");
      return;
    }

    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) {
      alert("Package not found");
      return;
    }

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

      if (!res.ok) {
        alert(data?.error || "Upgrade failed");
        return;
      }

      router.refresh();
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
        Loading packages...
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
            onBuy={buyPackage}         // 🔥 ID based
            onUpgrade={upgradePackage} // 🔥 ID based
          />
        ))}
      </div>
    </div>
  );
}
