"use client";

import { useState } from "react";
import Image from "next/image";

export default function DepositSystemAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex justify-between items-center"
      >
        <span className="text-[16px] font-semibold text-yellow-400">
          Deposit System Requirements
        </span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl p-4 text-[14px] text-gray-300 space-y-2 leading-6">
          <Image
            src="/introduction/Cryptocurrency approval system in action.png"
            alt="Deposit approval system"
            width={320}
            height={320}
            className="rounded-lg mx-auto mb-4"
          />

          <p>• Payment Method: Binance → USDT (TRC20)</p>
          <p>• Minimum Deposit: <b>$25</b></p>
          <p>• Deposit Approval: Admin manually</p>
          <p>• Deposit Status: Pending / Approved / Rejected & Returned</p>
          <p>• ID becomes active after deposit approval</p>
          <p>
            • Multiple deposits allowed for package upgrade:
            <br />
            $50, $100, $250, $500, $1,000, $2,500, $5,000, $10,000, $20,000
          </p>
        </div>
      )}
    </div>
  );
}
