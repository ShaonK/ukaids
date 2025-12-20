"use client";

import { useEffect, useState } from "react";

export default function GenerationHistoryClient() {
  const [tree, setTree] = useState([]);
  const [generationCounts, setGenerationCounts] = useState({});
  const [income, setIncome] = useState({ total: 0, levels: {} });
  const [directs, setDirects] = useState(0);
  const [expanded, setExpanded] = useState({});

  function toggle(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/user/generation-tree", {
        cache: "no-store",
      });
      const data = await res.json();

      setTree(data.tree || []);
      setGenerationCounts(data.generationCounts || {});
      setIncome(data.income || { total: 0, levels: {} });
      setDirects(data.directReferrals || 0);
    }

    load();
  }, []);

  const Node = ({ node }) => {
    const isOpen = expanded[node.id];
    const hasChildren = node.children?.length > 0;

    return (
      <div className="ml-4 border-l border-gray-700 pl-3 mt-2">
        <div
          className="flex items-start gap-2 cursor-pointer py-1"
          onClick={() => toggle(node.id)}
        >
          <span className="text-yellow-400 text-xs mt-1">
            {hasChildren ? (isOpen ? "▼" : "▶") : "•"}
          </span>

          <div>
            <p className="text-white text-sm font-semibold">
              {node.fullname} ({node.username})
            </p>

            <p className="text-xs text-gray-400">
              Generation: {node.generation}
            </p>

            <p className="text-xs text-yellow-400">
              Rate: {(node.rate * 100).toFixed(0)}%
            </p>

            {/* 🔐 LEVEL UNLOCK STATUS */}
            {node.isUnlocked ? (
              <p className="text-xs text-green-400">
                Level Unlocked
              </p>
            ) : (
              <p className="text-xs text-red-400">
                Locked ({node.unlockDirects}/{node.unlockRequired} directs)
              </p>
            )}
          </div>
        </div>

        {isOpen &&
          node.children?.map((child) => (
            <Node key={child.id} node={child} />
          ))}
      </div>
    );
  };

  return (
    <div className="p-4 text-white pb-20">
      <h2 className="text-xl font-bold text-center mb-4">
        Generation History
      </h2>

      {/* DIRECT REFERRALS */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4">
        <p className="text-yellow-400 font-semibold">
          Your Direct Referrals
        </p>
        <p className="text-green-400 text-lg">{directs}</p>
      </div>

      {/* TOTAL LEVEL INCOME */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4">
        <p className="text-yellow-400 font-semibold">
          Total Level Income
        </p>
        <p className="text-green-400 text-lg">
          {income.total.toFixed(2)}
        </p>
      </div>

      {/* GENERATION SUMMARY */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4">
        <p className="text-yellow-400 font-semibold mb-2">
          Generation Summary
        </p>

        {Object.keys(generationCounts).length === 0 && (
          <p className="text-gray-400 text-sm">
            No downline users.
          </p>
        )}

        {Object.keys(generationCounts).map((g) => (
          <div
            key={g}
            className="flex justify-between text-sm mb-1"
          >
            <span>
              Generation {g} — {generationCounts[g]} users
            </span>

            <span className="text-green-400">
              {income.levels[g]
                ? income.levels[g].toFixed(2)
                : "0.00"}
            </span>
          </div>
        ))}
      </div>

      {/* TREE */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg">
        <p className="text-yellow-400 font-semibold mb-2">
          Your Team Tree
        </p>

        {tree.length === 0 ? (
          <p className="text-gray-400 text-center">
            No referrals yet.
          </p>
        ) : (
          tree.map((node) => (
            <Node key={node.id} node={node} />
          ))
        )}
      </div>
    </div>
  );
}
