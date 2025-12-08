"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function NavBar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, []);

  return (
    <div
      className="
        sticky top-0 z-50
        w-full h-[34px] flex items-center justify-between px-6
        bg-gradient-to-r from-[#121212] via-[rgba(69,46,21,0.5)] to-[#121212]
      "
    >
      {/* Logo */}
      <Image src="/logo.png" alt="Logo" width={110} height={30} />

      {/* Username Box */}
      <div className="relative mr-10">
        <div
          className="p-[1.5px] rounded-[6px]"
          style={{
            width: "118px",
            height: "26px",
            background: "linear-gradient(90deg, #3B82F6, #C9771E)",
          }}
        >
          <div
            className="w-full h-full flex items-center px-3 rounded-[6px]"
            style={{ background: "#121212" }}
          >
            <span className="text-[14px] font-medium text-white flex-1">
              {username || "Loading..."}
            </span>

            <Image
              src="/useravater.png"
              alt="avatar"
              width={11}
              height={11}
              className="ml-2"
            />
          </div>
        </div>
      </div>

      {/* Global Icon */}
      <Image src="/globals.png" alt="global icon" width={20} height={20} />
    </div>
  );
}
