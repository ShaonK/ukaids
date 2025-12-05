"use client";

import { adminLogoutAction } from "@/app/admin/logout/action";
import { useRouter } from "next/navigation";

export default function AdminTopBar() {
    const router = useRouter();

    async function logout() {
        const res = await adminLogoutAction();
        if (res.success) {
            router.push("/admin/login");
        }
    }

    return (
        <header className="w-full bg-blue-700 text-white p-4 shadow flex justify-between items-center">
            <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
            </div>

            <button
                className="bg-white text-blue-700 px-3 py-1 rounded text-sm"
                onClick={logout}
            >
                Logout
            </button>
        </header>
    );
}
