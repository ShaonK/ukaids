"use client";

import { useState } from "react";
import Image from "next/image";

export default function WalletSystemAccordion() {
    const [open, setOpen] = useState(false);

    return (
        <div className="px-4 mt-4">
            <button
                onClick={() => setOpen(!open)}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex justify-between items-center"
            >
                <span className="text-[16px] font-semibold text-yellow-400">
                    Wallet System Overview
                </span>
                <span className="text-xl">{open ? "−" : "+"}</span>
            </button>

            {open && (
                <div className="mt-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl p-4 text-[14px] text-gray-300 space-y-2">
                    <Image
                        src="/introduction/Digital wallet network with earnings balance.png"
                        alt="Wallet system"
                        width={320}
                        height={320}
                        className="rounded-lg mx-auto mb-4"
                    />

                    <p>• Deposit Wallet (Account Balance)</p>
                    <p>• Total Earning / Withdraw Wallet</p>
                    <p>• ROI Wallet</p>
                    <p>• Referral Wallet</p>
                    <p>• Level Income Wallet</p>
                    <p>• Return Wallet</p>
                    <p>• Salary Wallet</p>
                    <p>• Donation Wallet</p>
                    <p>• Withdraw allowed only from Total Earning Wallet</p>
                    <p>• Withdraw Fee: 10%</p>
                    <p>• Withdraw Approval: Admin manually</p>
                </div>
            )}
        </div>
    );
}
