"use client";

import { useState } from "react";
import Image from "next/image";

export default function ReferralCommissionAccordion() {
    const [open, setOpen] = useState(false);

    return (
        <div className="px-4 mt-4">
            <button
                onClick={() => setOpen(!open)}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex justify-between items-center"
            >
                <span className="text-[16px] font-semibold text-yellow-400">
                    Direct Referral Commission
                </span>
                <span className="text-xl">{open ? "−" : "+"}</span>
            </button>

            {open && (
                <div className="mt-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl p-4 text-[14px] text-gray-300 space-y-2">
                    <Image
                        src="/introduction/Referral network team hierarchy illustration.png"
                        alt="Referral team system"
                        width={320}
                        height={320}
                        className="rounded-lg mx-auto mb-4"
                    />

                    <p>• Level 1 → 10%</p>
                    <p>• Level 2 → 3%</p>
                    <p>• Level 3 → 2%</p>
                    <p>• Commission generated only after deposit approval</p>
                    <p>• Only Active IDs are eligible</p>
                    <p>• Commission rates can be changed by admin</p>
                </div>
            )}
        </div>
    );
}
