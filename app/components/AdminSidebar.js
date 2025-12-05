"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const path = usePathname();

    const links = [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/users", label: "Users" },

        // ⭐ Deposit Menu
        { href: "/admin/deposits", label: "Deposits (Pending)" },
        { href: "/admin/deposits/approved", label: "Approved Deposits" },
        { href: "/admin/deposits/rejected", label: "Rejected Deposits" },

        { href: "/admin/withdraws", label: "Withdraws" },
        { href: "/admin/settings", label: "Settings" },
    ];

    return (
        <aside className="w-40 bg-white border-r shadow h-screen p-4 md:block">
            <nav className="space-y-3">
                {links.map((link) => {
                    const active = path === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block p-2 rounded text-sm font-medium ${active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
