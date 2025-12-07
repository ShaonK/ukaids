"use client";

export default function TeamDataOverview() {
  return (
    <div className="w-full flex justify-center mt-6 text-white">
      <div className="w-[360px] px-4">
        {/* Title */}
        <h2 className="text-[13px] font-semibold">Team Data Overview</h2>

        {/* Top Gradient Border Box */}
        <div
          className="w-[328px] mt-2 rounded-[5px] p-[1px] 
                        bg-[linear-gradient(90deg,#EC7B03,#3B82F6)]"
        >
          {/* Inner Box */}
          <div
            className="w-full h-[68px] bg-[#121212] rounded-[5px] 
                          flex items-center justify-between px-4"
          >
            {/* Left Section */}
            <div className="flex flex-col items-center w-[120px]">
              <span className="text-[14px] font-normal">Team Registration</span>
              <span className="text-[14px] font-bold mt-1 text-[#EC7B03]">
                5
              </span>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-[55px] bg-[#D9D9D9]"></div>

            {/* Right Section */}
            <div className="flex flex-col items-center w-[116px]">
              <span className="text-[14px] font-normal">
                Official Team Size
              </span>
              <span className="text-[14px] font-bold mt-1 text-[#EC7B03]">
                5
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Box */}
        <div
          className="w-[328px] mt-3 rounded-[5px] p-[1px]
                        bg-[linear-gradient(90deg,#EC7B03,#3B82F6)]"
        >
          <div
            className="w-full h-[31px] bg-[#121212] rounded-[5px] 
                          flex items-center justify-center"
          >
            <span className="text-[13px] font-normal">
              Position:
              <span className="font-bold text-[13px] ml-1 text-[#EC7B03]">
                Regular 1524744
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
