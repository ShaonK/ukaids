"use client";
import Image from "next/image";

export default function SpeakerMessage() {
  return (
    <div className="w-[328px] h-[30px] bg-[#C9771E] rounded-[80px] mx-auto mt-12 flex items-center px-4">
      {/* Speaker Icon */}
      <div className="rotate-[15deg] mr-3">
        <Image
          src="/speaker.png"
          alt="Speaker Icon"
          width={15}
          height={10}
          className="border border-white"
        />
      </div>

      {/* Text Message */}
      <p className="text-[14px] font-bold text-white leading-none">
        This lookup will list DNS Text (TXT) re
      </p>
    </div>
  );
}
