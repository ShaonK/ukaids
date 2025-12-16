import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-gray-400">
          Loading register...
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
