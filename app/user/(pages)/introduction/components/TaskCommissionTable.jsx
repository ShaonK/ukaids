"use client";

import { useState, useMemo } from "react";

export default function TeamBonusTable() {
  // ------------------------------------
  // MOCK TABLE DATA (ডাটাবেজ থেকে এলে সহজেই replace করা যাবে)
  // ------------------------------------
  const tableData = [
    {
      title: "Trainee Marketing Manager",
      target: "15 members/month",
      salary: "10,000",
      details: [
        "Daily subordinate bonus 3% of level 1 member.",
        "2% for level 2 subordinate income.",
        "1% for level 3 subordinate income.",
      ],
    },
    {
      title: "Full Marketing Manager",
      target: "30 members/month",
      salary: "22,000",
      details: ["Detailed breakdown coming from backend"],
    },
    {
      title: "Trainee Marketing Director",
      target: "150 members (total)",
      salary: "60,000",
      details: ["Bonus calculated monthly"],
    },
    {
      title: "Full Marketing Director",
      target: "800 members (total)",
      salary: "150,000",
      details: ["Includes leadership bonus"],
    },
    {
      title: "Trainers HR Director",
      target: "1,500 members (total)",
      salary: "150,000",
      details: ["Eligible for team bonus upgrade"],
    },
    {
      title: "Full HR Director",
      target: "3,000 members (total)",
      salary: "60,000",
      details: ["Target must be maintained monthly"],
    },
    {
      title: "Chief Marketing Officer (CMO)",
      target: "8,000 members (total)",
      salary: "1,500,000",
      details: ["Highest level bonus tier"],
    },
  ];

  // ------------------------------------
  // STATE
  // ------------------------------------
  const [page, setPage] = useState(1);
  const pageSize = 3;

  // ------------------------------------
  // PAGINATION (Fully Optimized)
  // ------------------------------------
  const totalPages = Math.ceil(tableData.length / pageSize);

  const start = (page - 1) * pageSize;

  const pageData = useMemo(() => {
    return tableData.slice(start, start + pageSize);
  }, [tableData, start, pageSize]);

  // ------------------------------------
  // ACCORDION
  // ------------------------------------
  const [openRow, setOpenRow] = useState(null);

  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };

  // ------------------------------------
  // JSX OUTPUT
  // ------------------------------------
  return (
    <div className="w-full mt-8 px-4 text-white">
      {/* Title */}
      <h2 className="text-[16px] font-semibold mb-3">
        Job Requirements & Fixed Salaries
      </h2>

      {/* Table Wrapper (Scrollable + Sticky Header) */}
      <div className="overflow-y-auto max-h-[400px] rounded-lg">
        {/* Table Header */}
        <div
          className="
            grid grid-cols-3
            bg-[linear-gradient(90deg,#EC7B03,#3B82F6)]
            text-[12px] font-semibold
            sticky top-0 z-10
          "
        >
          <div className="py-3 text-center">Position</div>
          <div className="py-3 text-center">Recruitment Target</div>
          <div className="py-3 text-center">Salary (BDT)</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#ffffff18] border border-[#ffffff10]">
          {pageData.map((row, idx) => (
            <div key={idx}>
              {/* Row Main */}
              <div
                onClick={() => toggleRow(idx)}
                className="
                  grid grid-cols-3 text-[11px] py-3 cursor-pointer
                  bg-[#D9D9D91A] hover:bg-[#ffffff15]
                  transition-all duration-200
                "
              >
                <div className="text-center px-2">{row.title}</div>
                <div className="text-center px-2">{row.target}</div>
                <div className="text-center px-2 font-semibold text-[#EC7B03]">
                  {row.salary}
                </div>
              </div>

              {/* Accordion Content */}
              {openRow === idx && (
                <div className="px-3 py-2 bg-[#0f0f0f] text-[11px] space-y-1 border-b border-[#ffffff20]">
                  {row.details.map((d, i) => (
                    <p key={i} className="text-[#FFA447] leading-4">
                      • {d}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-[#EC7B03] disabled:bg-gray-700 rounded text-white"
        >
          Prev
        </button>

        <span className="text-[13px]">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-[#3B82F6] disabled:bg-gray-700 rounded text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
