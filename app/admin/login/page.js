import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-gray-500">
          Loading admin login...
        </div>
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}
