"use client";

import { useState } from "react";

export default function JobRequirementsFixedSalaries() {
  const rows = [
    {
      position: "Trainee Marketing Manager",
      target: "15 members/month",
      salary: "10,000",
      details:
        "Additional performance bonus applies based on weekly performance.",
    },
    {
      position: "Full Marketing Manager",
      target: "30 members/month",
      salary: "22,000",
      details: "Team support allowance included.",
    },
    {
      position: "Trainee Marketing Director",
      target: "150 members (total)",
      salary: "60,000",
      details: "Eligible for leadership training program.",
    },
    {
      position: "Full Marketing Director",
      target: "800 members (total)",
      salary: "150,000",
      details: "Eligible for director-level benefits & revenue share.",
    },
    {
      position: "Trainee HR Director",
      target: "1,500 members (total)",
      salary: "150,000",
      details: "Performance-based KPI bonus applies.",
    },
    {
      position: "Full HR Director",
      target: "3,000 members (total)",
      salary: "60,000",
      details: "HR management reward system included.",
    },
    {
      position: "Chief Marketing Officer (CMO)",
      target: "8,000 members (total)",
      salary: "1,500,000",
      details: "Full company benefits, annual bonus & profit share.",
    },
  ];

  const [page, setPage] = useState(0);
  const pageSize = 4;
  const pagedRows = rows.slice(page * pageSize, page * pageSize + pageSize);

  const toggleRow = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [expanded, setExpanded] = useState({});

  return (
    <div className="mt-10 w-full flex flex-col items-center px-4 text-white">
      {/* Gradient Border Wrapper */}
      <div className="w-[328px] rounded-[10px] p-[1px] bg-[linear-gradient(90deg,#EC7B03,#3B82F6)]">
        {/* Inner Container */}
        <div className="rounded-[10px] bg-[#0f0f0f] p-0 overflow-hidden">
          {/* Sticky Header */}
          <div className="sticky top-0 w-full h-[38px] bg-[#ffffff25] backdrop-blur-md flex items-center px-3 justify-between z-10">
            <span className="text-[12px] font-semibold w-[33%] text-left whitespace-nowrap">
              Position
            </span>
            <span className="text-[12px] font-semibold w-[33%] text-center whitespace-nowrap">
              Recruitment Target
            </span>
            <span className="text-[12px] font-semibold w-[33%] text-right whitespace-nowrap">
              Salary (BDT)
            </span>
          </div>

          {/* Scrollable Rows */}
          <div className="max-h-[220px] overflow-y-auto custom-scroll">
            {pagedRows.map((row, i) => (
              <div key={i}>
                {/* Main Row */}
                <div
                  onClick={() => toggleRow(i)}
                  className="
                    w-full h-[38px] bg-[#D9D9D91A] 
                    flex items-center px-3 justify-between
                    border-b border-[#ffffff20]
                    cursor-pointer transition hover:bg-[#ffffff15]
                  "
                >
                  <span className="text-[10px] w-[33%] text-left leading-tight">
                    {row.position}
                  </span>

                  <span className="text-[10px] w-[33%] text-center leading-tight whitespace-nowrap">
                    {row.target}
                  </span>

                  <span className="text-[10px] w-[33%] text-right leading-tight">
                    {row.salary}
                  </span>
                </div>

                {/* Collapsible Details */}
                {expanded[i] && (
                  <div className="w-full bg-[#1a1a1a] px-3 py-2 text-[10px] text-[#e7e7e7] leading-tight border-b border-[#ffffff20]">
                    {row.details}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-2 bg-[#ffffff10]">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-2 py-1 text-xs rounded disabled:opacity-30 bg-[#3B82F6] hover:bg-[#2563eb]"
            >
              Prev
            </button>

            <span className="text-xs">
              Page {page + 1} / {Math.ceil(rows.length / pageSize)}
            </span>

            <button
              disabled={(page + 1) * pageSize >= rows.length}
              onClick={() => setPage(page + 1)}
              className="px-2 py-1 text-xs rounded disabled:opacity-30 bg-[#EC7B03] hover:bg-[#c96a00]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #EC7B03;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
}
