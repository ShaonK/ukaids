export const dynamic = "force-dynamic";

import { Suspense } from "react";
import AdminWithdrawsClient from "./AdminWithdrawsClient";

export default function AdminWithdrawsPage() {
  return (
    <Suspense
      fallback={
        <p className="p-4 text-gray-500">
          Loading withdraw requests…
        </p>
      }
    >
      <AdminWithdrawsClient />
    </Suspense>
  );
}
