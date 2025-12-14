"use client";

export default function PackageRow({
  pkg,
  activePackage,
  wallet,
  onBuy,
  onUpgrade,
}) {
  // active package check
  const isActive = activePackage?.packageId === pkg.id;

  // current active package position
  const activePosition = activePackage?.package?.position ?? null;

  // can upgrade only if higher position
  const canUpgrade =
    activePosition !== null && pkg.position > activePosition;

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4 flex justify-between items-center">
      {/* LEFT */}
      <div>
        <h3 className="text-white font-semibold">{pkg.name}</h3>
        <p className="text-sm text-gray-400">
          Amount: ${pkg.amount}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* ACTIVE */}
        {isActive && (
          <span className="px-3 py-1 text-xs rounded bg-green-600 text-white">
            Active
          </span>
        )}

        {/* UPGRADE */}
        {!isActive && canUpgrade && (
          <button
            onClick={onUpgrade}
            className="
              px-4 py-2 rounded-md text-sm font-semibold
              bg-gradient-to-r from-purple-500 to-pink-500
              text-white active:scale-95 transition
            "
          >
            Upgrade
          </button>
        )}

        {/* NOT AVAILABLE */}
        {!isActive && !canUpgrade && (
          <button
            disabled
            className="
              px-4 py-2 rounded-md text-sm font-semibold
              bg-gray-600 text-gray-300 cursor-not-allowed
            "
          >
            Not Available
          </button>
        )}

        {/* BUY (only when no active package at all) */}
        {!activePackage && (
          <button
            onClick={onBuy}
            className="
              px-4 py-2 rounded-md text-sm font-semibold
              bg-gradient-to-r from-[#3B82F6] to-[#EC7B03]
              text-white active:scale-95 transition
            "
          >
            Buy
          </button>
        )}
      </div>
    </div>
  );
}
