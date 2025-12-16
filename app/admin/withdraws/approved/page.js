import { Suspense } from "react";
import ApprovedWithdrawsClient from "./ApprovedWithdrawsClient";

export default function ApprovedWithdrawsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-gray-500">
          Loading approved withdraws...
        </div>
      }
    >
      <ApprovedWithdrawsClient />
    </Suspense>
  );
}
