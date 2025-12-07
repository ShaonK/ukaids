"use client";

import Image from "next/image";

export default function TaskCard({
  icon = "/tcardimage.png",
  order = "16.00 / Each Order",
  tasks = "Daily Tasks : 01",
  deposit = "Deposit : 75.00$",
  tag = "A1",
}) {
  return (
    <div
      className="
        w-[306px] h-[95px] mx-auto mt-5
        rounded-[16px] flex items-center justify-between px-4
        relative
      "
      style={{
        background: "linear-gradient(145deg, #1A1A1A, #0E0E0E)", // perfect for #121212
        borderRadius: "16px",
        boxShadow:
          "0px 6px 15px rgba(0,0,0,1), inset 0px 2px 4px rgba(255,255,255,0.03)",
      }}
    >
      {/* Soft Glow */}
      <div
        className="absolute inset-0 rounded-[16px] -z-10"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(255,180,80,0.15), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Left Icon Box */}
      <div
        className="w-[65px] h-[60px] rounded-[10px] flex justify-center items-center"
        style={{
          background: "linear-gradient(145deg, #222, #151515)",
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.7), 0 4px 10px rgba(0,0,0,0.7)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Image
          src={icon}
          alt="task icon"
          width={52}
          height={46}
          className="object-contain"
        />
      </div>

      {/* Text Section */}
      <div className="flex flex-col text-white text-[12.5px] font-semibold leading-[120%] ml-2">
        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">{order}</span>
        <span className="text-[#EC7B03] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
          {tasks}
        </span>
        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">{deposit}</span>
      </div>

      {/* Right Tag & Button */}
      <div className="flex flex-col items-center">
        {/* 3D Polygon Tag */}
        <div
          className="relative flex justify-center items-center text-[11px] font-bold text-white"
          style={{
            width: "50px",
            height: "56px",
            clipPath: "polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)",
            background: "linear-gradient(170deg, #9A773F 10%, #0C0B09 90%)",
            border: "2px solid",
            borderImage: "linear-gradient(180deg, #FFD08A 0%, #8B6A46 100%) 1",
            boxShadow:
              "0px 6px 14px rgba(0,0,0,0.9), inset 0 0 14px rgba(255,210,150,0.25)",
          }}
        >
          {tag}
        </div>

        {/* 3D Join Button */}
        <button
          className="mt-1 w-[75px] h-[18px] rounded-[12px] text-[9px] font-bold text-white"
          style={{
            background: "linear-gradient(92deg, #3C4A6B 0%, #70491F 100%)",
            boxShadow:
              "0px 4px 8px rgba(0,0,0,0.75), inset 0px 1px 3px rgba(255,255,255,0.08)",
          }}
        >
          Join Now
        </button>
      </div>
    </div>
  );
}
