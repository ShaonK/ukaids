"use client";

import Image from "next/image";

export default function HumanitarianNote() {
  return (
    <div className="px-4 mt-8">
      {/* Image */}
      <Image
        src="/introduction/Global digital finance and humanitarian network.png"
        alt="Global digital finance and humanitarian network"
        width={320}
        height={320}
        className="rounded-xl mx-auto mb-4"
      />

      {/* Title */}
      <h2 className="text-center text-[18px] font-semibold text-yellow-400 mb-3">
        Our Humanitarian Commitment
      </h2>

      {/* Content */}
      <div className="bg-[#111] border border-[#2A2A2A] p-4 rounded-xl text-[14px] text-gray-300 leading-6">
        UKAIDS is built on the principle of combining structured digital finance
        with humanitarian responsibility. Our platform supports global welfare
        initiatives focused on community development, relief operations, and
        social assistance.
        <br />
        <br />
        Humanitarian activities are managed independently and remain completely
        separate from user earnings, deposits, and incentive systems to ensure
        transparency and trust.
      </div>
    </div>
  );
}
