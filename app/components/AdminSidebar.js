"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Wallet,
    CheckCircle,
    XCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function AdminSidebar() {
    const path = usePathname();
    const [collapsed, setCollapsed] = useState(true);
    const sidebarRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        function handleClick(e) {
            if (!collapsed && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setCollapsed(true);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [collapsed]);

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/deposits", label: "Deposits (Pending)", icon: Wallet },
        { href: "/admin/deposits/approved", label: "Approved Deposits", icon: CheckCircle },
        { href: "/admin/deposits/rejected", label: "Rejected Deposits", icon: XCircle },
        { href: "/admin/withdraws", label: "Withdraws (Pending)", icon: Wallet },
        { href: "/admin/withdraws/approved", label: "Approved Withdraws", icon: CheckCircle },
        { href: "/admin/withdraws/rejected", label: "Rejected Withdraws", icon: XCircle },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <>
            {/* Backdrop */}
            {!collapsed && <div className="fixed inset-0 bg-black/40 z-40" />}

            {/* Toggle Button */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="
                        absolute left-2 top-3 z-[60]
                        w-9 h-9 rounded-full bg-white text-black shadow 
                        flex items-center justify-center
                    "
                >
                    <ChevronRight size={18} />
                </button>
            )}

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`
                    absolute left-0 top-0 h-full z-50
                    bg-[var(--sidebar-bg)]
                    shadow-xl overflow-hidden
                    transition-all duration-500
                    ${collapsed ? "w-0 opacity-0" : "w-[230px] opacity-100"}
                `}
            >

                {/* Close Button */}
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className="absolute -right-4 top-4 w-9 h-9 rounded-full bg-white text-black shadow flex items-center justify-center"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}

                {/* Menu */}
                {!collapsed && (
                    <nav className="mt-14 px-5">
                        {links.map((item) => {
                            const Icon = item.icon;
                            const active = path === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 py-2 rounded-lg`}
                                    style={{
                                        color: active ? "var(--menu-active-text)" : "var(--menu-text)",
                                        background: active ? "var(--menu-active-bg)" : "transparent",
                                    }}
                                >
                                    <Icon
                                        size={20}
                                        style={{
                                            color: active ? "var(--menu-active-text)" : "var(--icon-color)",
                                        }}
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </aside>
        </>
    );
}
