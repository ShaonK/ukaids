export function getPackageAction({ pkg, activePackage, wallet }) {
    if (!wallet) return "UNAVAILABLE";

    const balance = Number(wallet.mainWallet || 0);
    const price = Number(pkg.amount || 0);

    // 🔹 No active package → Buy
    if (!activePackage) {
        if (balance < price) return "INSUFFICIENT";
        return "BUY";
    }

    // 🔒 Safety: activePackage must include package
    if (!activePackage.package) {
        return "UNAVAILABLE";
    }

    const activePkg = activePackage.package;

    // 🔹 Current active package
    if (activePkg.id === pkg.id) {
        return "CURRENT";
    }

    // 🔹 Lower or same position → Not allowed
    if (pkg.position <= activePkg.position) {
        return "LOWER";
    }

    // 🔹 Upgrade but insufficient balance
    if (balance < price) {
        return "INSUFFICIENT";
    }

    // 🔹 Valid upgrade
    return "UPGRADE";
}
