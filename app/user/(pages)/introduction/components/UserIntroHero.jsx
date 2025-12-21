"use client";

import Image from "next/image";

export default function UserIntroHero() {
  return (
    <div className="px-4 py-6 text-center">
      <Image
        src="/introduction/UKAIDS platform introduction and features.png"
        alt="UKAIDS Platform Introduction"
        width={360}
        height={360}
        className="rounded-xl mx-auto mb-4"
        priority
      />

      <h1 className="text-[26px] font-bold text-yellow-400 mb-3">
        Welcome to UKAIDS
      </h1>

      <p className="text-[14px] text-gray-300 leading-6">
        UKAIDS is a transparent, rule-based participation platform that combines
        structured earning opportunities with humanitarian support initiatives.
      </p>
    </div>
  );
}
