import { Suspense } from "react";
import GetPageClient from "./GetPageClient";

export default function GetPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-gray-400">
          Loading task…
        </div>
      }
    >
      <GetPageClient />
    </Suspense>
  );
}
