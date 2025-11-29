"use client";

export default function DailyKeyScore({ name = "dks bbs", score = 70 }) {
  return (
    <div className="w-full flex flex-col items-center mt-2 mb-2">
      {/* Name */}
      <h2 className="text-[16px] font-semibold text-white text-center">
        {name}
      </h2>

      {/* Score */}
      <p className="text-[14px] font-semibold text-[#E07503] mt-1 text-center">
        Behavior Score : {score}
      </p>
    </div>
  );
}
