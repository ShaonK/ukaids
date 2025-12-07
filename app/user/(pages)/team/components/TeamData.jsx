"use client";

import TeamDataCard from "./TeamDataCard";

export default function TeamData({ items }) {
  return (
    <div className="mt-6 px-4">
      {/* Main Title */}
      <h2 className="text-[16px] font-semibold text-white">Team Data</h2>

      {/* Render Multiple Cards Dynamically */}
      {items?.map((item, index) => (
        <TeamDataCard
          key={index}
          title={item.title}
          registration={item.registration}
          percentage={item.percentage}
          revenue={item.revenue}
        />
      ))}
    </div>
  );
}
