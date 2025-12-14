"use client";

export default function PackageRow({ pkg, activePackage, wallet }) {
    const isActive = activePackage?.id === pkg.id;
    const canUpgrade =
        activePackage && pkg.amount > activePackage.amount;

    const buy = async () => {
        await fetch("/api/user/package/deposit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ packageId: pkg.id }),
        });
        location.reload();
    };

    const upgrade = async () => {
        await fetch("/api/user/package/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ packageId: pkg.id }),
        });
        location.reload();
    };

    return (
        <div
            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4
      rounded-xl px-5 py-4 border transition
      ${isActive
                    ? "border-orange-500 bg-[#1a130a]"
                    : "border-gray-800 bg-[#121212] hover:border-orange-400"
                }`}
        >
            {/* LEFT */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 font-semibold">
                    {pkg.name.charAt(0)}
                </div>

                <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                        {pkg.name}
                        {isActive && (
                            <span className="text-xs bg-orange-500 text-black px-2 py-0.5 rounded-full">
                                Active
                            </span>
                        )}
                    </h3>
                    <p className="text-sm text-gray-400">
                        Investment Amount: ৳{pkg.amount}
                    </p>
                </div>
            </div>

            {/* MIDDLE */}
            <div className="flex gap-6 text-sm">
                <div>
                    <p className="text-gray-400">Daily ROI</p>
                    <p className="text-green-400 font-medium">
                        {pkg.dailyRoi}%
                    </p>
                </div>

                <div>
                    <p className="text-gray-400">Duration</p>
                    <p className="text-white">{pkg.duration} Days</p>
                </div>

                <div>
                    <p className="text-gray-400">Total Return</p>
                    <p className="text-orange-400 font-semibold">
                        ৳{pkg.totalReturn}
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="md:text-right">
                {isActive ? (
                    <button
                        disabled
                        className="px-5 py-2 rounded-lg bg-gray-700 text-gray-300 cursor-not-allowed"
                    >
                        Active
                    </button>
                ) : canUpgrade ? (
                    <button
                        onClick={upgrade}
                        className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-medium"
                    >
                        Upgrade
                    </button>
                ) : (
                    <button
                        onClick={buy}
                        className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-medium"
                    >
                        Buy
                    </button>
                )}

                {wallet?.balance < pkg.amount && !isActive && (
                    <p className="text-xs text-red-400 mt-1">
                        Insufficient balance
                    </p>
                )}
            </div>
        </div>
    );
}
