"use client";

import { useState } from "react";
import Image from "next/image";

const ranks = [
  { rank: "1 Star", direct: 10, team: "-", salary: "$40", duration: "3 Months" },
  { rank: "2 Star", direct: 25, team: "-", salary: "$120", duration: "3 Months" },
  { rank: "3 Star", direct: 25, team: "125 (5 Gen)", salary: "$400", duration: "3 Months" },
  { rank: "4 Star", direct: 25, team: "750 (5 Gen)", salary: "$1,000", duration: "3 Months" },
  { rank: "5 Star", direct: 25, team: "2,250 (5 Gen)", salary: "$2,000", duration: "3 Months" },
  { rank: "6 Star", direct: 25, team: "6,750 (5 Gen)", salary: "$4,000", duration: "3 Months" },
  { rank: "7 Star", direct: 25, team: "13,500 (5 Gen)", salary: "$8,000", duration: "Lifetime" },
];

export default function VIPRankAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex justify-between items-center"
      >
        <span className="text-[16px] font-semibold text-yellow-400">
          VIP Rank & Salary System
        </span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-3 bg-[#0f0f0f] border border-[#2A2A2A] rounded-xl p-4 text-[14px] text-gray-300 space-y-4">
          <Image
            src="/introduction/VIP progression ladder with badges.png"
            alt="VIP Rank Progression"
            width={320}
            height={320}
            className="rounded-lg mx-auto"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border border-[#2A2A2A] mt-3">
              <thead className="bg-[#1a1a1a] text-yellow-400">
                <tr>
                  <th className="p-2 border">Rank</th>
                  <th className="p-2 border">Direct Ref</th>
                  <th className="p-2 border">Team</th>
                  <th className="p-2 border">Salary</th>
                  <th className="p-2 border">Duration</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((r, i) => (
                  <tr key={i} className="text-center">
                    <td className="p-2 border">{r.rank}</td>
                    <td className="p-2 border">{r.direct}</td>
                    <td className="p-2 border">{r.team}</td>
                    <td className="p-2 border text-yellow-400 font-semibold">
                      {r.salary}
                    </td>
                    <td className="p-2 border">{r.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1 leading-6">
            <p>• Salary starts after <b>30 days</b> of achieving rank</p>
            <p>• Salary paid <b>once per month</b></p>
            <p>• 7 Star rank has <b>no salary limit</b></p>
            <p>• Rank conditions & salary are admin configurable</p>
          </div>
        </div>
      )}
    </div>
  );
}
