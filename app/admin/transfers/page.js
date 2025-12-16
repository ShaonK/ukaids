import { Suspense } from "react";
import AdminTransfersClient from "./AdminTransfersClient";

export default function AdminTransfersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-gray-500">
          Loading transfer requests...
        </div>
      }
    >
      <AdminTransfersClient />
    </Suspense>
  );
}
