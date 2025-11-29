"use client";

import { useState } from "react";

export default function TeamPerformanceBonusPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const sections = [
    {
      title: "Tiered Salary Increase Structure:",
      text: `When ABC-level teams exceed 150 full-time employees:
30%+ VIP3 or higher employees → 30% salary increase
40%+ VIP3 or higher employees → 40% salary increase
50%+ VIP3 or higher employees → 50% salary increase`,
    },
    {
      title: "Payroll Administration:",
      text: `Monthly salary calculations occur on the 1st based on actual working days.
Salary disbursement occurs on the 15th of each month.
All payments are deposited to employees' BBH account.`,
    },
    {
      title: "Important Notes:",
      text: `Eligibility requires minimum 150 full-time team members.
VIP3+ designation refers to high-performing employee tiers.
Pro-rated calculations apply for partial month service.`,
    },
  ];

  return (
    <div className="w-full px-4 mt-8 text-white flex flex-col items-center">
      {/* Main Title */}
      <h2 className="text-[16px] font-semibold">
        Team Performance Bonus Policy
      </h2>

      {/* OUTER Gradient Border */}
      <div className="w-[328px] mt-4 rounded-[8px] p-[1.5px] bg-[linear-gradient(180deg,#3B82F6,#EC7B03)] shadow-lg">
        {/* INNER CARD */}
        <div className="bg-[#1a1a1a] rounded-[8px] p-4 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
          {sections.map((sec, i) => (
            <div key={i} className="mb-4">
              {/* Accordion Header */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex justify-between items-center py-2"
              >
                <span className="text-[#EC7B03] font-semibold text-[14px]">
                  {sec.title}
                </span>

                {/* Custom SVG Arrow */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className={`transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="#EC7B03"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-[13px] leading-[18px] mt-2 whitespace-pre-line opacity-90">
                  {sec.text}
                </p>
              </div>

              {/* Gradient Divider */}
              {i < sections.length - 1 && (
                <div className="h-[1px] w-full mt-3 bg-gradient-to-r from-[#EC7B03] to-[#3B82F6]"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Orange Line */}
      <div className="w-[290px] h-[1px] bg-[#EC7B03] mt-4"></div>
    </div>
  );
}
