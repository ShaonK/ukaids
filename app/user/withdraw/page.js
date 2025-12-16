import { Suspense } from "react";
import WithdrawClient from "./WithdrawClient";

export default function WithdrawPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-gray-400 py-10">
          Loading withdraw page...
        </p>
      }
    >
      <WithdrawClient />
    </Suspense>
  );
}
