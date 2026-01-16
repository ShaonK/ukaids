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
  ClipboardList,
  Package2,
  Star, // ⭐ NEW
} from "lucide-react";

export default function AdminSidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setCollapsed(true);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [collapsed]);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/reports/weekly", label: "Weekly Report", icon: Users },

    // ⭐ VIP RANK
    {
      href: "/admin/rank-eligible", label: "Rank Eligible Users", icon: Star },

    { href: "/admin/packages", label: "Packages", icon: Package2 },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },

    { href: "/admin/deposits", label: "Deposits (Pending)", icon: Wallet },
    { href: "/admin/deposits/approved", label: "Approved Deposits", icon: CheckCircle },
    { href: "/admin/deposits/rejected", label: "Rejected Deposits", icon: XCircle },

    { href: "/admin/withdraws", label: "Withdraws (Pending)", icon: Wallet },
    { href: "/admin/withdraws/approved", label: "Approved Withdraws", icon: CheckCircle },
    { href: "/admin/withdraws/rejected", label: "Rejected Withdraws", icon: XCircle },

    { href: "/admin/transfers", label: "Transfers", icon: Wallet },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/wallet-history", label: "Wallet Credit History", icon: ClipboardList },

  ];

  return (
    <>
      {!collapsed && <div className="fixed inset-0 bg-black/40 z-40" />}

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute left-2 top-3 z-[60] w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <aside
        ref={sidebarRef}
        className={`absolute left-0 top-0 h-full z-50 bg-[var(--sidebar-bg)] shadow-xl transition-all duration-500 ${collapsed ? "w-0 opacity-0" : "w-[230px] opacity-100"
          }`}
      >
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="absolute -right-4 top-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {!collapsed && (
          <nav className="mt-14 px-5 space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const active =
                path === item.href || path.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 py-2 px-2 rounded-lg transition-colors"
                  style={{
                    color: active
                      ? "var(--menu-active-text)"
                      : "var(--menu-text)",
                    background: active
                      ? "var(--menu-active-bg)"
                      : "transparent",
                  }}
                >
                  <Icon size={20} />
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
