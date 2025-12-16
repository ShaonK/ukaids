"use client";

import { useRouter } from "next/navigation";

export default function PackageRow({
  pkg,
  packages,
  activePackage,
  accountBalance, // 🔥 NEW (mainWallet)
  onBuy,
  onUpgrade,
}) {
  const router = useRouter();

  const isActive = activePackage?.packageId === pkg.id;

  const activePkgFromList = packages.find(
    (p) => p.id === activePackage?.packageId
  );

  const activePosition = activePkgFromList?.position ?? null;

  const canUpgrade =
    activePosition !== null && pkg.position > activePosition;

  const noActivePackage = !activePackage;

  function handleBuy() {
    if (accountBalance < pkg.amount) {
      router.push("/user/mine/recharge");
      return;
    }
    onBuy(pkg.id);
  }

  function handleUpgrade() {
    if (accountBalance < pkg.amount) {
      router.push("/user/mine/recharge");
      return;
    }
    onUpgrade(pkg.id);
  }

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="text-white font-semibold">{pkg.name}</h3>
        <p className="text-sm text-gray-400">
          Amount: ${pkg.amount}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {isActive && (
          <span className="px-3 py-1 text-xs rounded bg-green-600 text-white">
            Active
          </span>
        )}

        {!isActive && canUpgrade && (
          <button
            onClick={handleUpgrade}
            className="px-4 py-2 rounded-md text-sm font-semibold
              bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Upgrade
          </button>
        )}

        {noActivePackage && (
          <button
            onClick={handleBuy}
            className="px-4 py-2 rounded-md text-sm font-semibold
              bg-gradient-to-r from-[#3B82F6] to-[#EC7B03] text-white"
          >
            Buy
          </button>
        )}

        {activePackage && !isActive && !canUpgrade && (
          <button
            disabled
            className="px-4 py-2 rounded-md text-sm font-semibold
              bg-gray-600 text-gray-300 cursor-not-allowed"
          >
            Not Available
          </button>
        )}
      </div>
    </div>
  );
}
