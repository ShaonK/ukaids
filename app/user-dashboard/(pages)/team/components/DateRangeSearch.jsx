"use client";

import { useState } from "react";

export default function DateRangeSearch() {
  const [startDate, setStartDate] = useState("2025/10/10");
  const [endDate, setEndDate] = useState("2025/10/10");

  return (
    <div className="flex items-center gap-2 px-4 mt-6">
      {/* Start Date Button */}
      <button
        className="
          w-[103px] h-[25px] 
          bg-[#D9D9D9] text-black 
          rounded-[4px] flex items-center justify-center 
          text-[13px] font-normal
        "
        onClick={() => {}}
      >
        {startDate}
      </button>

      {/* End Date Button */}
      <button
        className="
          w-[103px] h-[25px] 
          bg-[#D9D9D9] text-black 
          rounded-[4px] flex items-center justify-center 
          text-[13px] font-normal
        "
        onClick={() => {}}
      >
        {endDate}
      </button>

      {/* Search Button */}
      <button
        className="
          w-[75px] h-[25px] 
          bg-[#EC7B03] text-white 
          rounded-[2px] flex items-center justify-center 
          text-[13px] font-bold
        "
        onClick={() => console.log("Search Clicked")}
      >
        Buscar
      </button>
    </div>
  );
}
