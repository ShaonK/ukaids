"use client";

import Image from "next/image";

export default function PlatformOverviewCard() {
    return (
        <div className="px-4 mt-6">
            <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 text-center">
                <Image
                    src="/introduction/UKAIDS platform overview and benefits.png"
                    alt="UKAIDS platform overview and benefits"
                    width={320}
                    height={320}
                    className="rounded-lg mx-auto mb-4"
                />

                <h2 className="text-[18px] font-semibold text-yellow-400 mb-2">
                    Platform Overview & Benefits
                </h2>

                <p className="text-[14px] text-gray-300 leading-6">
                    UKAIDS is designed to provide a transparent earning system combined
                    with humanitarian support. Users benefit from structured deposits,
                    ROI-based earnings, referral rewards, and long-term VIP income plans.
                </p>
            </div>
        </div>
    );
}
