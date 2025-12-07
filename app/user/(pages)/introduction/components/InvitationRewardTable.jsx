"use client";

export default function InvitationRewardTable({ rewards, notes }) {
  return (
    <div className="w-full px-4 mt-6">
      {/* Title */}
      <h2 className="text-center text-[22px] font-bold text-yellow-400 mb-4">
        Invitation Reward Table
      </h2>

      {/* Table Container */}
      <div className="w-full bg-[#101010] border border-[#2A2A2A] rounded-xl p-4 shadow-md">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-[#1A1A1A] text-white font-semibold text-[13px] py-3 rounded-md border border-[#333]">
          <span className="text-center">Level</span>
          <span className="text-center">Level 3 Invite</span>
          <span className="text-center">Level 1 Reward</span>
          <span className="text-center">Level 2 Reward</span>
        </div>

        {/* Table Rows */}
        <div className="mt-2 space-y-2">
          {rewards.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-4 bg-[#0F0F0F] text-white text-[12px] py-3 rounded-md border border-[#2A2A2A]"
            >
              <span className="text-center">{item.level}</span>
              <span className="text-center">{item.level3Invite}</span>
              <span className="text-center">{item.firstLevelReward}</span>
              <span className="text-center">{item.level2Reward}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes / Description */}
      <div className="mt-5 text-[13px] text-gray-300 leading-6 space-y-4 bg-[#111] p-4 rounded-lg border border-[#2A2A2A]">
        {notes.map((note, index) => (
          <p key={index}>
            <span className="text-yellow-400 font-semibold">• </span>
            {note}
          </p>
        ))}
      </div>
    </div>
  );
}
