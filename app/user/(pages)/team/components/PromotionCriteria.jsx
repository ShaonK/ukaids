"use client";

export default function PromotionCriteria({ leftItems, rightItems }) {
  return (
    <div className="mt-8 w-full flex flex-col items-center px-4 text-white">
      {/* Title */}
      <h2 className="text-[16px] font-semibold mb-2 w-full">
        Promotion Criteria :
      </h2>

      {/* Gradient Border */}
      <div className="w-[328px] rounded-[8px] p-[1px] bg-[linear-gradient(180deg,#3B82F6_0.48%,#EC7B03_100%)]">
        {/* Inner Background */}
        <div className="rounded-[8px] bg-[#D9D9D91A] p-4">
          {/* Row Container */}
          <div className="space-y-2">
            {leftItems.map((left, index) => (
              <div key={index} className="pb-2 border-b border-[#FFFFFF33]">
                <div className="flex justify-between items-start">
                  {/* LEFT COLUMN */}
                  <span className="text-[11px] leading-[16px] w-[48%]">
                    {left}
                  </span>

                  {/* RIGHT COLUMN */}
                  <span className="text-[11px] leading-[16px] w-[48%] text-right">
                    {rightItems[index] || ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
