"use client";

import Image from "next/image";

export default function InviteButton() {
  return (
    <div
      className="
        w-[328px] 
        h-[53px] 
        bg-[#606F73] 
        rounded-[7px] 
        flex 
        items-center 
        px-4 
        mx-auto 
        mt-4
      "
    >
      {/* Left Icon Section */}
      <div className="flex items-center justify-center w-[40px] h-[32px] mr-4">
        <Image
          src="/invite.png"
          alt="invite"
          width={40}
          height={33}
          className="object-contain"
        />
      </div>

      {/* Text Section */}
      <div className="flex flex-col leading-tight">
        <span className="text-white text-[16px] font-bold">Invite to Join</span>
        <span className="text-white text-[12px] font-semibold mt-[-2px]">
          Invite New Employees
        </span>
      </div>
    </div>
  );
}
