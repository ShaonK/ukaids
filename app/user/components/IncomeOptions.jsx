"use client";
import { useRouter } from "next/navigation";

export default function IncomeOptions() {
  const router = useRouter();

  const options = [
    { label: "Refer Income", tab: "referral" },
    { label: "Daily Income", tab: "roi" },
    { label: "Month Income", tab: "account" },
    { label: "Level Income", tab: "level" },
  ];

  function go(tab) {
    router.push(`/user/wallet/history?tab=${tab}`);
  }

  return (
    <div className="w-[360px] mx-auto mt-6 px-6">
      <div className="grid grid-cols-2 gap-4">
        {options.map((item, index) => (
          <button
            key={index}
            onClick={() => go(item.tab)}
            className="
              w-[150px] h-[60px]
              rounded-[14px]
              flex items-center justify-center
              font-bold text-[14px]
              text-white
              active:scale-[0.97]
              relative overflow-hidden
              transition-all duration-200
            "
            style={{
              background:
                "linear-gradient(180deg, #1b1b1b 0%, #0f0f0f 100%)",
              boxShadow:
                "0px 6px 14px rgba(0,0,0,0.8), inset 0px -4px 6px rgba(0,0,0,0.7), inset 0px 4px 8px rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Inner depth */}
            <div
              className="absolute inset-0 rounded-[14px] pointer-events-none"
              style={{
                boxShadow:
                  "inset 0px 6px 12px rgba(0,0,0,0.8), inset 0px -4px 6px rgba(255,255,255,0.03)",
              }}
            />

            {/* Text */}
            <span
              className="
                relative z-10
                bg-gradient-to-b from-[#FFE3A3] to-[#D79B42]
                bg-clip-text text-transparent
                drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]
              "
            >
              {item.label}
            </span>

            {/* Press overlay */}
            <div
              className="absolute inset-0 opacity-0 active:opacity-20 transition-all"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(0,0,0,0.3))",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
