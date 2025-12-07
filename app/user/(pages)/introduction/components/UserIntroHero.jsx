"use client";

import Image from "next/image";

export default function UserIntroHero() {
  return (
    <div className="w-full flex flex-col items-center text-center">

      {/* Gradient Border Wrapper */}
      <div className="
        w-[95%] 
        rounded-xl 
        p-[2px] 
        bg-[linear-gradient(180deg,#3B82F6,#EC7B03)]
      ">
        {/* Inner Image Container */}
        <div className="relative rounded-xl overflow-hidden w-full h-[480px] bg-black">
          <Image
            src="/user-intro-hero.png"
            alt="UKAIDS Introduction Banner"
            fill
            priority
            className="object-cover object-top"
          />
        </div>
      </div>

    </div>
  );
}
