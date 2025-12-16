import { Suspense } from "react";
import TransferHistoryClient from "./TransferHistoryClient";

export default function TransferHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-gray-400">
          Loading transfer history…
        </div>
      }
    >
      <TransferHistoryClient />
    </Suspense>
  );
}
