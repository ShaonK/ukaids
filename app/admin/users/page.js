export const dynamic = "force-dynamic";

import { getAdmin } from "@/lib/getAdmin";
import { redirect } from "next/navigation";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const admin = await getAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminUsersClient />;
}
