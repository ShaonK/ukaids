"use client";

export default function PositionResponsibilities({ items }) {
  return (
    <div className="mt-6 w-full flex flex-col items-center px-4">
      {/* Title */}
      <h2 className="text-[16px] font-semibold text-white w-full">
        Position Responsibilities
      </h2>

      {/* Responsibility List */}
      <div className="mt-3 space-y-4 w-[306px]">
        {items.map((text, index) => (
          <div
            key={index}
            className="text-[14px] leading-[20px] font-bold flex"
          >
            {/* Number (white) */}
            <span className="text-white mr-2">{index + 1}.</span>

            {/* Text (#C9771E) */}
            <span className="text-[#C9771E]">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
