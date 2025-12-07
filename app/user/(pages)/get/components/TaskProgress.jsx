"use client";

export default function TaskProgress({
  completed = 0,
  total = 5,
  onStart = () => {},
}) {
  return (
    <div className="w-[92%] mt-6 mx-auto bg-[#1A1A1A] rounded-xl p-5">
      <div className="flex justify-between text-white text-[22px] font-bold">
        <span>Start</span>
        <span>
          {completed} / {total}
        </span>
      </div>

      <div className="w-full h-[2px] bg-[#555] mt-3" />

      <button
        onClick={onStart}
        className="w-full bg-[#FF964A] text-black py-3 rounded-lg mt-4 text-[18px] font-semibold"
      >
        Start Now
      </button>
    </div>
  );
}
