"use client";

import { useState } from "react";
import Image from "next/image";

export default function WithdrawSystemAccordion() {
    const [open, setOpen] = useState(false);

    return (
        <div className="px-4 mt-4">
            <button
                onClick={() => setOpen(!open)}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex justify-between items-center"
            >
                <span className="text-[16px] font-semibold text-yellow-400">
                    Withdrawal System
                </span>
                <span className="text-xl">{open ? "−" : "+"}</span>
            </button>

            {open && (
                <div className="mt-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl p-4 text-[14px] text-gray-300 space-y-3 leading-6">
                    <Image
                        src="/introduction/Digital wallet withdrawal process in action.png"
                        alt="Withdraw system"
                        width={320}
                        height={320}
                        className="rounded-lg mx-auto mb-3"
                    />

                    <p>• Withdraw allowed only from <b>Total Earning Wallet</b></p>
                    <p>• Minimum withdraw limit starts from <b>$5</b></p>
                    <p>
                        • Withdraw limits:
                        <br />
                        $5 → $10 → $25 → $50 → $100 → $250 → $500 → $1,000 → $2,000 → $5,000 → $10,000
                    </p>
                    <p>• Withdraw fee: <b>10%</b></p>
                    <p>• Payment method: <b>USDT (TRC20)</b></p>
                    <p>• Withdraw processing: <b>Admin manual</b></p>
                    <p>
                        • Withdraw open day:
                        <br />
                        <b>Friday (12:00 PM – 6:00 PM)</b>
                    </p>
                    <p>• Anti-fraud & security checks applied</p>
                    <p>• Withdraw rules are admin configurable</p>
                </div>
            )}
        </div>
    );
}
