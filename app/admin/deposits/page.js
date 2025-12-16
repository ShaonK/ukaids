import { Suspense } from "react";
import AdminDepositsClient from "./rejected/AdminDepositsClient";

export default function AdminDepositsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-gray-400">
          Loading pending deposits...
        </div>
      }
    >
      <AdminDepositsClient />
    </Suspense>
  );
}
