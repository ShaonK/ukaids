import { Suspense } from "react";
import WithdrawAddressClient from "./WithdrawAddressClient";

export default function WithdrawAddressPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-gray-400 py-10">
          Loading withdraw address...
        </p>
      }
    >
      <WithdrawAddressClient />
    </Suspense>
  );
}
