"use client";

import Image from "next/image";

export default function NavBar() {
  return (
    <div
      className="
        w-full h-[34px] flex items-center justify-between px-3 mt-[1px]
        bg-gradient-to-r from-[#121212] via-[rgba(69,46,21,0.5)] to-[#121212]
      "
    >
      {/* Left: Logo */}
      <div className="font-inter font-bold text-[15px] leading-none">
        One <span className="font-bold text-[#d49e08]">Th</span>
      </div>

      {/* Middle: Username box */}
      {/* USERNAME BOX WITH GRADIENT BORDER */}
      <div
        className="flex items-center rounded-[2px] px-4 mr-10"
        style={{
          width: "118px",
          height: "26px",
          background: "transparent", // কোনো ভিতরের কালার নেই
          borderWidth: "1px",
          borderStyle: "solid",
          borderImageSlice: 1,
          borderImageSource: "linear-gradient(90deg, #3B82F6 0%, #C9771E 100%)",
        }}
      >
        {/* Username */}
        <span className="text-[14px] font-medium text-white flex-1">
          Ranny dk
        </span>

        {/* Avatar */}
        <Image
          src="/useravater.png"
          alt="avatar"
          width={11}
          height={11.25}
          className="ml-2"
        />
      </div>

      {/* Right: Global Icon */}
      <Image
        src="/global.png"
        alt="global icon"
        className="w-[12px] h-[12px]"
        width={12}
        height={12}
      />
    </div>
  );
}
