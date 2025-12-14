export function getPackageAction({ pkg, activePackage, wallet }) {
    if (!wallet) return "UNAVAILABLE";

    // No active package → Buy
    if (!activePackage) {
        if (wallet.mainWallet < pkg.amount) return "INSUFFICIENT";
        return "BUY";
    }

    // Current package
    if (activePackage.packageId === pkg.id) {
        return "CURRENT";
    }

    // Lower or same position → Not allowed
    if (pkg.position <= activePackage.package.position) {
        return "LOWER";
    }

    // Upgrade but insufficient balance
    if (wallet.mainWallet < pkg.amount) {
        return "INSUFFICIENT";
    }

    return "UPGRADE";
}
