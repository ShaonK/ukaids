import { Suspense } from "react";
import HomeClient from "./HomeClient";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-400 py-20">
          Loading...
        </div>
      }
    >
      <HomeClient />
    </Suspense>
  );
}
