"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StickyBottomNav() {
  const pathname = usePathname();

  const items = [
    {
      key: "home",
      path: "/user",
      icon: "/BottomHomeIcon.png",
      label: "Home",
    },
    {
      key: "intro",
      path: "/user/introduction",
      icon: "/BottomntroductionIcon.png",
      label: "Introduction",
    },
    {
      key: "get",
      path: "/user/get",
      icon: "/BottomGetIcon.png",
      label: "Get",
    },
    {
      key: "team",
      path: "/user/team",
      icon: "/BottomTeamIcon.png",
      label: "Team",
    },
    {
      key: "mine",
      path: "/user/mine",
      icon: "/BottomProfileIcon.png",
      label: "Mine",
    },
  ];

  return (
    <nav
      aria-label="Bottom navigation"
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 
        w-[360px] h-[92px]
        z-50 
      "
    >
      {/* Floating Island Background */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[340px] h-[68px] rounded-[20px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,18,18,0.9), rgba(28,28,28,0.85))",
          boxShadow:
            "0 18px 50px rgba(0,0,0,0.7), 0 6px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.03)",
          backdropFilter: "blur(6px)",
          transform: "translateY(8px)",
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[340px] h-[68px] rounded-[20px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 10%, rgba(255,180,80,0.05), transparent 35%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Icon Row */}
      <div className="relative z-20 h-full flex items-end justify-between px-6">
        {items.map((item) => {
          const isCenter = item.key === "get";
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.key}
              href={item.path}
              className="flex flex-col items-center gap-1 transition-all duration-200"
              style={{
                transform: isCenter ? "translateY(-18px)" : "translateY(0)",
                zIndex: isCenter ? 50 : 20,
              }}
            >
              <div
                className="flex items-center justify-center rounded-full transition-all duration-200"
                style={{
                  width: isCenter ? 72 : 48,
                  height: isCenter ? 72 : 48,
                  background: isCenter
                    ? "linear-gradient(145deg, rgba(255,200,120,0.14), rgba(255,180,90,0.06))"
                    : "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.25))",
                  boxShadow: isCenter
                    ? "0 18px 40px rgba(0,0,0,0.6), inset 0 3px 8px rgba(255,180,90,0.12)"
                    : "0 8px 18px rgba(0,0,0,0.55)",
                  border: isCenter
                    ? "1px solid rgba(255,200,120,0.1)"
                    : "1px solid rgba(255,255,255,0.05)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={isCenter ? 40 : 26}
                  height={isCenter ? 40 : 26}
                  className={
                    isCenter
                      ? "drop-shadow-[0_6px_18px_rgba(255,180,90,0.5)]"
                      : ""
                  }
                />
              </div>

              <span
                className="text-[12px] font-semibold"
                style={{
                  color: isActive ? "#FFD08A" : "#E6E6E6",
                  textShadow: isActive
                    ? "0 0 6px rgba(255,200,120,0.5)"
                    : "none",
                  marginTop: isCenter ? -6 : 4,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
