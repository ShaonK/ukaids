"use client";

export default function HeaderButtons({
  startLabel = "Start",
  taskListLabel = "Task List",
}) {
  return (
    <div className="flex w-full justify-center gap-3 mt-4">
      <button className="px-8 py-2 bg-[#FF964A] text-black font-semibold rounded-lg">
        {startLabel}
      </button>

      <button className="px-8 py-2 bg-[#2A2A2A] text-white border border-[#FF964A] rounded-lg">
        {taskListLabel}
      </button>
    </div>
  );
}
