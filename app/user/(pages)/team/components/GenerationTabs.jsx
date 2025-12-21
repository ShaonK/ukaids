"use client";

import { useState } from "react";
import GenerationUserList from "./GenerationUserList";

export default function GenerationTabs({ team, counts }) {
  const [active, setActive] = useState(1);

  const users = team.filter((u) => u.generation === active);

  return (
    <>
      <div className="flex gap-2 mt-4 px-4 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((g) => (
          <button
            key={g}
            onClick={() => setActive(g)}
            className={`px-3 py-2 rounded
              ${active === g ? "bg-orange-500" : "bg-gray-700"}
            `}
          >
            <div>Gen {g}</div>
            <div className="text-xs opacity-80">
              {counts[g]} users
            </div>
          </button>
        ))}
      </div>

      <GenerationUserList users={users} generation={active} />
    </>
  );
}
