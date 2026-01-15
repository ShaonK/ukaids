"use client";

import { useState } from "react";
import GenerationUserList from "./GenerationUserList";

export default function GenerationTabs({ team }) {
  const [active, setActive] = useState("1");

  // 🔹 group users by generation
  const grouped = team.reduce((acc, u) => {
    acc[u.generation] = acc[u.generation] || [];
    acc[u.generation].push(u);
    return acc;
  }, {});

  const allGenerations = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  // 🔹 stats helper
  const getStats = (users = []) => {
    const tu = users.length;
    const td = users.reduce(
      (sum, u) => sum + Number(u.totalDeposit || 0),
      0
    );
    return { tu, td };
  };

  const hasMoreThanFive =
    allGenerations.length > 5;

  const visibleGenerations = hasMoreThanFive
    ? [1, 2, 3, 4, 5]
    : allGenerations;

  // 🔥 G6+ users (only if >5 gen)
  const g6PlusUsers = hasMoreThanFive
    ? team.filter(
        (u) => Number(u.generation) >= 6
      )
    : [];

  const g6Stats = getStats(g6PlusUsers);

  return (
    <>
      {/* 🔹 GENERATION BUTTON GRID (MAX 6) */}
      <div className="grid grid-cols-3 gap-2 mt-4 px-2">
        {visibleGenerations.map((g) => {
          const users = grouped[g] || [];
          const { tu, td } = getStats(users);

          return (
            <button
              key={g}
              onClick={() => setActive(String(g))}
              className={`p-2 rounded-lg text-center
                ${
                  active === String(g)
                    ? "bg-gradient-to-br from-orange-500 to-pink-600"
                    : "bg-[#1f1f1f]"
                }
                text-white shadow`}
            >
              <div className="font-bold text-sm">
                G-{g}
              </div>
              <div className="text-[11px] text-green-400">
                TU-{tu}
              </div>
              <div className="text-[11px] text-blue-400">
                TD-{td.toFixed(2)}
              </div>
            </button>
          );
        })}

        {/* 🔥 G6+ (ONLY IF NEEDED) */}
        {hasMoreThanFive && (
          <button
            onClick={() => setActive("6+")}
            className={`p-2 rounded-lg text-center
              ${
                active === "6+"
                  ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                  : "bg-[#1f1f1f]"
              }
              text-white shadow`}
          >
            <div className="font-bold text-sm">
              G6+
            </div>
            <div className="text-[11px] text-green-400">
              TU-{g6Stats.tu}
            </div>
            <div className="text-[11px] text-blue-400">
              TD-{g6Stats.td.toFixed(2)}
            </div>
          </button>
        )}
      </div>

      {/* 🔹 USER LIST */}
      {active !== "6+" && (
        <GenerationUserList
          users={grouped[Number(active)] || []}
          generation={active}
        />
      )}
    </>
  );
}
