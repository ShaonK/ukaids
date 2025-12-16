import { Suspense } from "react";
import StatusHistoryClient from "./StatusHistoryClient";

export default function StatusHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-gray-400">
          Loading status history…
        </div>
      }
    >
      <StatusHistoryClient />
    </Suspense>
  );
}
