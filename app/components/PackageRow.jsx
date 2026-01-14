"use client";

export default function PackageRow({
  pkg,
  packages,
  activePackage,
  onBuy,
  onUpgrade,
}) {
  const isUserActive = activePackage?.packageId === pkg.id;

  const activePkgFromList = packages.find(
    (p) => p.id === activePackage?.packageId
  );

  const activePosition = activePkgFromList?.position ?? null;

  const isAboveActive =
    activePosition !== null && pkg.position > activePosition;

  const isBelowActive =
    activePosition !== null && pkg.position < activePosition;

  const noActivePackage = !activePackage;

  const isAdminInactive = !pkg.isActive;

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-xl flex justify-between items-center border border-gray-800">
      <div>
        <h3 className="text-white font-semibold">{pkg.name}</h3>
        <p className="text-gray-400">${pkg.amount}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* 🟢 USER ACTIVE */}
        {isUserActive && (
          <span className="px-3 py-1 bg-orange-500 text-black text-xs rounded-full">
            Active
          </span>
        )}

        {/* 🔒 LOWER THAN ACTIVE */}
        {isBelowActive && (
          <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded">
            Locked
          </span>
        )}

        {/* ⏳ ADMIN INACTIVE */}
        {isAboveActive && isAdminInactive && (
          <span className="px-3 py-1 bg-gray-600 text-white text-xs rounded">
            Upcoming
          </span>
        )}

        {/* 🔵 UPGRADE */}
        {isAboveActive && !isAdminInactive && (
          <button
            onClick={() => onUpgrade(pkg.id)}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
          >
            Upgrade
          </button>
        )}

        {/* 🟢 BUY (only if no active package) */}
        {noActivePackage && !isAdminInactive && (
          <button
            onClick={() => onBuy(pkg.id)}
            className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
          >
            Buy
          </button>
        )}

        {/* ⏳ BUY UPCOMING */}
        {noActivePackage && isAdminInactive && (
          <span className="px-3 py-1 bg-gray-600 text-white text-xs rounded">
            Upcoming
          </span>
        )}
      </div>
    </div>
  );
}
