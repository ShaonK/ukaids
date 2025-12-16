import { Suspense } from "react";
import WalletHistoryClient from "./WalletHistoryClient";

export default function WalletHistoryPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-gray-400 py-10">
          Loading wallet history...
        </p>
      }
    >
      <WalletHistoryClient />
    </Suspense>
  );
}
