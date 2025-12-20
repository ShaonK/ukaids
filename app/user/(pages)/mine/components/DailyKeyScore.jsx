"use client";

import { useEffect, useState } from "react";

export default function DailyKeyScore() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("User");
  const [score, setScore] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        // assuming you already have this API
        const res = await fetch("/api/user/profile", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!mounted) return;

        setName(data?.user?.fullname || data?.user?.username || "User");

        /**
         * 🧠 TEMP behavior score logic
         * You can replace this later with DB value
         */
        const calculatedScore = Math.min(
          100,
          Math.max(
            40,
            Number(data?.user?.isActive ? 70 : 50)
          )
        );

        setScore(calculatedScore);

      } catch (err) {
        console.error("DAILY KEY SCORE ERROR:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div className="w-full mt-3 text-center text-gray-500 text-sm">
        Loading score…
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center mt-3 mb-3">

      {/* Name */}
      <h2 className="text-[17px] font-semibold text-white tracking-wide">
        {name}
      </h2>

      {/* Score Card */}
      <div className="mt-2 px-4 py-2 rounded-full
        bg-gradient-to-r from-[#1f1f1f] to-[#121212]
        border border-[#2a2a2a]
        shadow-sm
      ">
        <p className="text-[13px] text-gray-300">
          Behavior Score
        </p>

        <p
          className={`
            text-center text-[20px] font-bold mt-1
            ${score >= 80
              ? "text-green-400"
              : score >= 60
              ? "text-orange-400"
              : "text-red-400"}
          `}
        >
          {score}%
        </p>
      </div>
    </div>
  );
}
