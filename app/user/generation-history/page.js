import { Suspense } from "react";
import GenerationHistoryClient from "./GenerationHistoryClient";

export default function GenerationHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-gray-400">
          Loading generation history…
        </div>
      }
    >
      <GenerationHistoryClient />
    </Suspense>
  );
}
