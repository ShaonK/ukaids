export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ApprovedDepositsClient from "./ApprovedDepositsClient";

export default function ApprovedDepositsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-gray-500">
          Loading approved deposits...
        </div>
      }
    >
      <ApprovedDepositsClient />
    </Suspense>
  );
}
