import { Suspense } from "react";
import TransferClient from "./TransferClient";

export default function TransferPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-gray-400">
          Loading transfer page…
        </div>
      }
    >
      <TransferClient />
    </Suspense>
  );
}
