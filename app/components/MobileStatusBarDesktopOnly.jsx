"use client";

import { useEffect, useState } from "react";

export default function MobileStatusBarDesktopOnly() {
  const [time, setTime] = useState("");
  const [battery, setBattery] = useState(100);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();

      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes.toString().padStart(2, "0")}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadBattery() {
      try {
        if (navigator.getBattery) {
          const batt = await navigator.getBattery();
          setBattery(Math.round(batt.level * 100));

          batt.addEventListener("levelchange", () => {
            setBattery(Math.round(batt.level * 100));
          });
        }
      } catch {}
    }
    loadBattery();
  }, []);

  return (
    <div
      className="
      fixed top-0 left-1/2 -translate-x-1/2
      w-[360px] h-9
      flex items-center justify-between px-4
      text-white bg-[#0A0A0A]/80 backdrop-blur-lg
      z-50 shadow-md
    "
    >
      <span>{time}</span>
      <span>{battery}%</span>
    </div>
  );
}
