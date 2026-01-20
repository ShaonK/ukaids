export const dynamic = "force-dynamic";

import { Suspense } from "react";
import AdminDashboardClient from "./AdminDashboardClient";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading dashboard…
        </div>
      }
    >
      <AdminDashboardClient />
    </Suspense>
  );
}
