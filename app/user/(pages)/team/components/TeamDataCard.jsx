"use client";

export default function TeamDataCard({
  title,
  registration,
  percentage,
  revenue,
}) {
  return (
    <div className="mt-4">
      {/* Card Title */}
      <h3 className="text-[16px] font-normal text-white">{title}</h3>

      {/* Gradient Border Box */}
      <div
        className="w-[328px] h-[78px] mt-2 rounded-[7px] p-[1px]
                      bg-[linear-gradient(180deg,#3B82F6_0.48%,#EC7B03_100%)]"
      >
        <div className="w-full h-full bg-[#121212] rounded-[7px] flex justify-between items-center px-3">
          {/* Left Section */}
          <div className="flex flex-col items-center w-[90px]">
            <span className="text-[16px] font-bold text-white">
              {registration}
            </span>
            <span className="text-[14px] text-[#E07503] mt-1">
              Registration
            </span>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col items-center w-[90px]">
            <span className="text-[16px] font-bold text-white">
              {percentage}%
            </span>
            <span className="text-[14px] text-[#E07503] mt-1 text-center leading-4">
              Commission Percentage
            </span>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center w-[90px]">
            <span className="text-[16px] font-bold text-white">{revenue}</span>
            <span className="text-[14px] text-[#E07503] mt-1 text-center leading-4">
              Accumulated Revenue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
