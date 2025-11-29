"use client";

export default function LevelDescriptionList({ sections }) {
  return (
    <div className="w-full px-4 mt-6 text-white">
      {sections.map((section, index) => (
        <div key={index} className="mb-1">
          {/* Section Title */}
          <h2 className="text-center text-[#F2C94C] text-[20px] font-bold mb-1">
            {section.title}
          </h2>

          {/* Items */}
          <div className="space-y-4">
            {section.items.map((item, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#2A2A2A] p-4 rounded-lg shadow-md"
              >
                <p className="text-[#F2C94C] text-[14px] font-semibold mb-1">
                  {item.position}
                </p>

                <p className="text-[13px] leading-5 text-[#E0E0E0]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
