"use client";

import { useEffect, useState } from "react";

export default function MobileStatusBar() {
  const [time, setTime] = useState("");
  const [battery, setBattery] = useState(100);

  useEffect(() => {
    // TIME UPDATE
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();

      hours = hours % 12 || 12; // 12-hour format

      setTime(`${hours}:${minutes.toString().padStart(2, "0")}`);
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // BATTERY UPDATE
    async function loadBattery() {
      try {
        if (navigator.getBattery) {
          const batt = await navigator.getBattery();
          setBattery(Math.round(batt.level * 100));

          batt.addEventListener("levelchange", () => {
            setBattery(Math.round(batt.level * 100));
          });
        } else {
          // Fallback animation battery (for browsers that don’t support Battery API)
          let fakeBattery = 100;
          setInterval(() => {
            fakeBattery = fakeBattery <= 10 ? 100 : fakeBattery - 1;
            setBattery(fakeBattery);
          }, 2000);
        }
      } catch (e) {
        console.log("Battery API not supported");
      }
    }

    loadBattery();

    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div
      className="
      fixed top-0 left-1/2 -translate-x-1/2
      w-[360px] h-9
      flex items-center justify-between 
      px-4
      text-white text-[13px] font-semibold
      bg-[#0A0A0A]/80 backdrop-blur-lg
      z-50 shadow-md
    "
      style={{ WebkitBackdropFilter: "blur(10px)" }}
    >
      {/* TIME */}
      <span className="tracking-wide">{time}</span>

      {/* ICONS */}
      <div className="flex items-center gap-3">
        {/* SIGNAL BARS */}
        <div className="flex items-end gap-[2px]">
          <div className="w-[3px] h-[5px] bg-white/60 rounded"></div>
          <div className="w-[3px] h-[7px] bg-white/70 rounded"></div>
          <div className="w-[3px] h-[9px] bg-white/80 rounded"></div>
          <div className="w-[3px] h-[11px] bg-white rounded"></div>
        </div>

        {/* WIFI */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="white"
          className="opacity-90"
        >
          <path d="M12 18.5c-.7 0-1.2.5-1.2 1.2s.5 1.2 1.2 1.2 1.2-.5 1.2-1.2-.5-1.2-1.2-1.2zm5.3-3c-1.5-1.5-3.5-2.3-5.3-2.3s-3.8.8-5.3 2.3l1.4 1.4c1-1 2.4-1.6 3.9-1.6s2.9.6 3.9 1.6l1.4-1.4zm3-3c-2.3-2.3-5.2-3.6-8.3-3.6s-6 1.3-8.3 3.6l1.4 1.4c1.9-1.9 4.4-3 6.9-3s5 1.1 6.9 3l1.4-1.4z" />
        </svg>

        {/* BATTERY */}
        <div className="flex items-center gap-[2px]">
          <div className="w-7 h-3.5 border border-white rounded-[4px] flex items-center p-[2px]">
            <div
              className="h-full bg-white rounded-[2px] transition-all duration-300"
              style={{ width: `${(battery / 100) * 22}px` }}
            />
          </div>
          <div className="w-1 h-2 bg-white rounded-sm"></div>

          {/* Battery Percentage */}
          <span className="text-[11px] opacity-90">{battery}%</span>
        </div>
      </div>
    </div>
  );
}
