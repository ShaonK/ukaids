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

            {/* Collapsed toggle button */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="fixed left-4 top-4 z-[60] w-10 h-10 rounded-full bg-white text-black shadow-lg 
                     flex items-center justify-center hover:scale-105 transition-all"
                >
                    <ChevronRight size={18} />
                </button>
            )}

            {/* Sidebar ALWAYS in DOM */}
            <aside
                ref={sidebarRef}
                className={`
                    fixed left-0 top-0 h-screen z-50 
                    bg-[var(--sidebar-bg)]
                    shadow-xl overflow-hidden
                    transition-all duration-500 ease-in-out
                    ${collapsed ? "w-0 opacity-0 -translate-x-full" : "w-[230px] opacity-100 translate-x-0"}
                `}
                style={{ borderRadius: "0 20px 20px 0" }}
            >
                {/* Collapse button */}
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className="absolute -right-5 top-5 w-10 h-10 rounded-full bg-white text-black shadow-lg 
                           flex items-center justify-center hover:scale-105 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}

                {/* Title section */}
                {!collapsed && (
                    <div className="pt-10 px-[var(--sidebar-padding)]">
                        <h1
                            className="font-bold"
                            style={{
                                fontSize: "var(--title-size)",
                                color: "var(--title-color)",
                            }}
                        >
                            Admin
                        </h1>

                        <p
                            className="mt-6"
                            style={{
                                fontSize: "var(--section-title-size)",
                                color: "var(--section-title-color)",
                            }}
                        >
                            Control Panel
                        </p>
                    </div>
                )}

                {/* Menu */}
                {!collapsed && (
                    <nav className="mt-10 px-[var(--sidebar-padding)]">
                        {links.map((item) => {
                            const Icon = item.icon;
                            const active = path === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-6 rounded-lg transition-all no-underline"
                                    style={{
                                        height: "var(--menu-row-height)",
                                        background: active ? "var(--menu-active-bg)" : "transparent",
                                        color: active ? "var(--menu-active-text)" : "var(--menu-text)",
                                    }}
                                >
                                    <Icon
                                        size={22}
                                        style={{
                                            color: active ? "var(--menu-active-text)" : "var(--icon-color)",
                                            marginRight: "8px",
                                        }}
                                    />
                                    <span style={{ fontSize: "var(--menu-text-size)" }}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </aside>
        </>
    );
}
