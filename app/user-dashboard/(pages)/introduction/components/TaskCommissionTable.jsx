"use client";

export default function TaskCommissionTable({ tableData, notes, warnings }) {
  return (
    <div className="w-full px-4 mt-6">
      {/* Title */}
      <h2 className="text-center text-[22px] font-bold text-yellow-400 mb-4">
        Task Commission Table
      </h2>

      {/* TABLE BOX */}
      <div className="w-full bg-[#101010] border border-[#2A2A2A] rounded-xl p-4 shadow-md">
        {/* HEADER */}
        <div className="grid grid-cols-5 bg-[#1A1A1A] text-white font-semibold text-[12px] py-3 rounded-md border border-[#333]">
          <span className="text-center">Level</span>
          <span className="text-center">Level 3 Task %</span>
          <span className="text-center">A-level</span>
          <span className="text-center">B-level</span>
          <span className="text-center">C-level</span>
        </div>

        {/* ROWS */}
        <div className="mt-2 space-y-2">
          {tableData.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-5 bg-[#0F0F0F] text-white text-[12px] py-3 rounded-md border border-[#2A2A2A]"
            >
              <span className="text-center">{row.level}</span>
              <span className="text-center">{row.taskPercent}</span>
              <span className="text-center">{row.aReward}</span>
              <span className="text-center">{row.bReward}</span>
              <span className="text-center">{row.cReward}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NOTES */}
      <div className="mt-5 space-y-4 bg-[#111] p-4 rounded-lg border border-[#2A2A2A]">
        {notes.map((note, idx) => (
          <p key={idx} className="text-[13px] text-gray-300 leading-6">
            <span className="text-yellow-400 font-bold mr-2">•</span>
            {note}
          </p>
        ))}
      </div>

      {/* WARNINGS */}
      <div className="mt-5 space-y-2 bg-[#111] p-4 rounded-lg border border-[#2A2A2A]">
        <h3 className="text-yellow-400 font-semibold text-[14px]">
          Warm Suggestions:
        </h3>

        {warnings.map((warn, idx) => (
          <p key={idx} className="text-[13px] text-gray-400 leading-6">
            - {warn}
          </p>
        ))}
      </div>
    </div>
  );
}
