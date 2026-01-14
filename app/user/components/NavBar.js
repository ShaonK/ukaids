"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Navbar load error", err);
      }
    }

    loadMe();
  }, []);

  return (
    <div
      className="
        sticky top-0 z-50
        w-full h-[42px] flex items-center justify-between px-6
        bg-gradient-to-r from-[#121212] via-[rgba(69,46,21,0.5)] to-[#121212]
      "
    >
      {/* Logo */}
      <Image src="/logo.png" alt="Logo" width={110} height={30} />

      {/* User Box (NO RANK, NO AVATAR) */}
      <div className="relative mr-10">
        <div
          className="p-[1.5px] rounded-[6px]"
          style={{
            width: "150px",
            background: "linear-gradient(90deg, #3B82F6, #C9771E)",
          }}
        >
          <div
            className="w-full px-3 py-1 rounded-[6px] flex items-center"
            style={{ background: "#121212" }}
          >
            <p className="text-[13px] font-medium text-white leading-4 truncate">
              {user?.username || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* Global Icon */}
      <Image src="/globals.png" alt="global icon" width={20} height={20} />
    </div>
  );
}
