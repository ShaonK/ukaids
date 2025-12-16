import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function UserDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-400 py-20">
          Loading dashboard...
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
