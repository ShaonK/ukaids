"use client";

export default function LevelBenefitTable({ tableData }) {
  // tableData = {
  //   header: [...],
  //   intern: [...],
  //   sections: [
  //     { title: "...", rows: [...] },
  //   ]
  // }

  // Reusable section renderer
  const renderSection = (section) => (
    <div key={section.title} className="mt-6">
      <h2 className="text-center text-[#E9C87B] font-bold text-lg mb-2">
        {section.title}
      </h2>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-center border-collapse">
          <tbody>
            {section.rows.map((row, i) => (
              <tr
                key={i}
                className="bg-[#1A1A1A] border-b border-[#333] hover:bg-[#262626] transition"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-3 py-3 text-white text-[13px] border border-[#2a2a2a]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 py-6">
      {/* Main Title */}
      <h1 className="text-center text-[28px] font-extrabold text-[#F9E07F] drop-shadow-lg">
        Level benefit table
      </h1>

      {/* Header */}
      <div className="overflow-x-auto mt-4 rounded-lg border border-[#3B82F6]">
        <table className="w-full text-center bg-[#111] border-collapse">
          <thead>
            <tr className="bg-[#222]">
              {tableData.header.map((head, i) => (
                <th
                  key={i}
                  className="py-3 px-2 text-[#F7D87A] text-sm border border-[#333]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          {/* Intern Row */}
          <tbody>
            <tr className="bg-[#1A1A1A] border-b border-[#333]">
              {tableData.intern.map((cell, j) => (
                <td
                  key={j}
                  className="py-3 px-2 text-white text-[13px] border border-[#333]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* All Dynamic Sections */}
      {tableData.sections.map((section) => renderSection(section))}

      {/* Footer */}
      <p className="text-[#E9C87B] mt-6 text-[13px] leading-5">
        The trial period for beginners is four days. No deposit is required.
        Five tasks per day yield 16 BDT (80 BDT/day), total 320 BDT.
      </p>
    </div>
  );
}
