import { Suspense } from "react";
import RechargePageClient from "./RechargePageClient";

export default function RechargePage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-gray-400">
          Loading recharge…
        </div>
      }
    >
      <RechargePageClient />
    </Suspense>
  );
}
