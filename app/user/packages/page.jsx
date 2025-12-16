import { Suspense } from "react";
import PackagesPageClient from "./PackagesPageClient";

export default function PackagesPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-400 py-20">
          Loading packages…
        </div>
      }
    >
      <PackagesPageClient />
    </Suspense>
  );
}
