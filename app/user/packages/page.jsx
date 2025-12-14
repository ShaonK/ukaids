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

        setPackages(pkgData);
        setActivePackage(activeData);
        setWallet(walletData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ---------------------------
  // BUY PACKAGE (only when no active package)
  // ---------------------------
  const buyPackage = async (pkg) => {
    if (!wallet || wallet.mainWallet < pkg.amount) {
      router.push("/user/mine/recharge");
      return;
    }

    try {
      const res = await fetch("/api/user/package/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
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
  // UPGRADE PACKAGE (when active exists)
  // ---------------------------
  const upgradePackage = async (pkg) => {
    if (!wallet || wallet.mainWallet < pkg.amount) {
      router.push("/user/mine/recharge");
      return;
    }

    try {
      const res = await fetch("/api/user/package/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
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

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading packages...
      </div>
    );
  }

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
            activePackage={activePackage}
            wallet={wallet}
            onBuy={() => buyPackage(pkg)}
            onUpgrade={() => upgradePackage(pkg)}
          />
        ))}
      </div>
    </div>
  );
}
