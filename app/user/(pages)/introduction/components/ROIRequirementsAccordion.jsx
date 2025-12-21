"use client";

import { useState } from "react";
import Image from "next/image";

export default function ROIRequirementsAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex justify-between items-center"
      >
        <span className="text-[16px] font-semibold text-yellow-400">
          ROI & Earnings Requirements
        </span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl p-4 text-[14px] text-gray-300 space-y-2 leading-6">
          <Image
            src="/introduction/Futuristic ROI and passive income chart.png"
            alt="ROI system"
            width={320}
            height={320}
            className="rounded-lg mx-auto mb-4"
          />

          <p>• ROI Rate: <b>2% daily</b> (admin configurable)</p>
          <p>• ROI Days: 5 days per week (Monday–Friday)</p>
          <p>• ROI Closed: Saturday & Sunday</p>
          <p>• ROI applies only to the latest active deposit</p>
          <p>• No partial cap system</p>
          <p>• ROI runs once every 24 hours (cron based)</p>
          <p>
            • ROI limit: When ROI reaches <b>2×</b>, ID becomes inactive and
            balance moves to Return Wallet
          </p>
        </div>
      )}
    </div>
  );
}
