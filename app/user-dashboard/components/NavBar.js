"use client";

import Image from "next/image";

export default function NavBar() {
  return (
    <div
      className="
        w-full h-[34px] flex items-center justify-between px-6 mt-[1px]
        bg-gradient-to-r from-[#121212] via-[rgba(69,46,21,0.5)] to-[#121212]
      "
    >
      {/* Left: Logo Image */}
      <div className="flex items-center">
        <Image
          src="/logo.png" // ← তোমার PNG লোগো
          alt="UKAIDS Logo"
          width={110}
          height={30}
          priority
        />
      </div>

      {/* Middle: Username box */}
      <div className="relative mr-10">
        {/* OUTER GRADIENT BORDER WRAPPER */}
        <div
          className="p-[1.5px] rounded-[6px]"
          style={{
            width: "118px",
            height: "26px",
            background: "linear-gradient(90deg, #3B82F6, #C9771E)",
          }}
        >
          {/* INNER BOX */}
          <div
            className="w-full h-full flex items-center px-3 rounded-[6px]"
            style={{
              background: "#121212", // navbar এর ব্যাকগ্রাউন্ড অনুযায়ী
            }}
          >
            <span className="text-[14px] font-medium text-white flex-1">
              Ranny dk
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

      {/* Right: Global Icon */}
      <Image
        src="/globals.png"
        alt="global icon"
        width={20}
        height={20}
        className="w-[20px] h-[20px]"
      />
    </div>
  );
}
