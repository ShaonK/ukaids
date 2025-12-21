"use client";

export default function PackageRow({
  pkg,
  packages,
  activePackage,
  onBuy,
  onUpgrade,
}) {
  const isActive = activePackage?.packageId === pkg.id;

  const activePkgFromList = packages.find(
    (p) => p.id === activePackage?.packageId
  );

  const activePosition = activePkgFromList?.position ?? null;

  const isAboveActive =
    activePosition !== null && pkg.position > activePosition;

  const isBelowActive =
    activePosition !== null && pkg.position < activePosition;

  const noActivePackage = !activePackage;

  const isUpcoming = !pkg.isActive;

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="text-white font-semibold">{pkg.name}</h3>
        <p className="text-gray-400">${pkg.amount}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* 🟢 ACTIVE */}
        {isActive && (
          <span className="px-3 py-1 bg-green-600 text-white text-xs rounded">
            Active
          </span>
        )}

        {/* 🔒 BELOW ACTIVE */}
        {isBelowActive && (
          <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded">
            Locked
          </span>
        )}

        {/* ⏳ UPCOMING */}
        {isAboveActive && isUpcoming && (
          <span className="px-3 py-1 bg-gray-600 text-white text-xs rounded">
            Upcoming
          </span>
        )}

        {/* 🟣 UPGRADE */}
        {isAboveActive && !isUpcoming && (
          <button
            onClick={() => onUpgrade(pkg.id)}
            className="px-3 py-1 bg-purple-600 text-white text-xs rounded"
          >
            Upgrade
          </button>
        )}

        {/* 🔵 BUY (only when no active package) */}
        {noActivePackage && !isUpcoming && (
          <button
            onClick={() => onBuy(pkg.id)}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
          >
            Buy
          </button>
        )}

        {noActivePackage && isUpcoming && (
          <span className="px-3 py-1 bg-gray-600 text-white text-xs rounded">
            Upcoming
          </span>
        )}
      </div>
    </div>
  );
}
