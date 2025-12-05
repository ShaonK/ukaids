"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const path = usePathname();

    const items = [
        { href: "/user/home", label: "Home" },
        { href: "/user/introduction", label: "Intro" },
        { href: "/user/get", label: "Get" },
        { href: "/user/team", label: "Team" },
        { href: "/user/my", label: "My" },
    ];

    return (
        <nav className="
        fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-[420px]
        bg-white border-t shadow-lg
        flex justify-around items-center p-3 z-50
        ">

            {items.map((item) => {
                const active = path === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`text-sm ${active ? "text-blue-600 font-bold" : "text-gray-500"}`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
