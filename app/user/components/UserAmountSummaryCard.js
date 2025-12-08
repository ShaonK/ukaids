"use client";

import Image from "next/image";

export default function UserAmountSummaryCard({ title = "Account Balance", amount = "0.00 USD" }) {
  return (
    <div className="w-full flex justify-center mt-4 ml-5">
      {/* RECTANGLE (slightly smaller for perfect centering) */}
      <div
        className="relative w-[300px] h-[61px] bg-[#EC7B03]
        rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px]"
      >
        {/* LEFT CIRCLE: moved inward so total width fits 360px */}
        <div
          className="absolute -left-[40px] -top-[20px] w-[100px] h-[100px]
          rounded-full flex items-center justify-center p-[2px]"
          style={{
            background:
              "linear-gradient(192deg, #121212 18.79%, rgba(255,137,11,0.8) 90.91%)",
          }}
        >
          <div className="w-full h-full rounded-full bg-[#121212] flex justify-center items-center px-2 text-center">
            <span className="text-[12px] font-semibold text-white leading-tight">
              {title}
            </span>
          </div>
        </div>

        {/* CENTER BOX → adjusted for new rectangle width */}
        <div
          className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[150px] h-[40px] bg-white rounded-[10px]
          flex items-center justify-center
        "
        >
          <span className="text-[16px] font-bold text-black tracking-[0.5%]">
            {amount}
          </span>
        </div>

        {/* RIGHT BOX: stays same */}
        <div
          className="absolute right-0 top-0 w-[53px] h-[61px]
          bg-white rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[40px]
          flex items-center justify-center"
        >
          <Image
            src="/file-icon.png"
            alt="file-icon"
            width={27}
            height={26}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
