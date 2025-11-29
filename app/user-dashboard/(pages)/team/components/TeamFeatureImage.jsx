"use client";

import Image from "next/image";

export default function TeamFeatureImage() {
  return (
    <div className="mt-6 flex justify-center w-full">
      {/* Gradient border wrapper */}
      <div className="w-[307px] h-[192px] rounded-[7px] p-[1px]
        bg-[linear-gradient(180deg,#3B82F6_0.48%,#EC7B03_100%)]">

        {/* Image inside */}
        <div className="w-full h-full bg-[#121212] rounded-[7px] overflow-hidden">
          <Image
            src="/teamFeatureImage.png"
            alt="Team Feature"
            width={307}
            height={192}
            className="object-cover w-full h-full"
          />
        </div>

      </div>
    </div>
  );
}
