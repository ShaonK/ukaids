import { Suspense } from "react";
import RejectedWithdrawsClient from "./RejectedWithdrawsClient";

export default function RejectedWithdrawsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-gray-500">
          Loading rejected withdraws...
        </div>
      }
    >
      <RejectedWithdrawsClient />
    </Suspense>
  );
}
