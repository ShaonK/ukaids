"use client";

import { useEffect, useState } from "react";

const LEVEL_RATES = {
  1: 0.05,
  2: 0.04,
  3: 0.03,
  4: 0.02,
  5: 0.01,
};

export default function GenerationHistoryPage() {
  const [tree, setTree] = useState([]);
  const [genCounts, setGenCounts] = useState({});
  const [income, setIncome] = useState({ total: 0, levels: {}, fromUsers: {} });
  const [directs, setDirects] = useState(0);
  const [expanded, setExpanded] = useState({});

  function toggle(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function load() {
    const res = await fetch("/api/user/generation-tree");
    const data = await res.json();

    setTree(data.tree);
    setGenCounts(data.generationCounts);
    setIncome(data.income);
    setDirects(data.directReferrals);
  }

  useEffect(() => {
    load();
  }, []);

  const Node = ({ node }) => {
    const isOpen = expanded[node.id];
    const hasChild = node.children.length > 0;
    const rateDisplay = LEVEL_RATES[node.generation] ? (LEVEL_RATES[node.generation] * 100) + "%" : "0%";

    const gotIncome = income.fromUsers[node.id];
    const requiredDirect = node.generation;
    const levelUnlocked = directs >= requiredDirect;

    return (
      <div className="ml-4 border-l border-gray-700 pl-3 mt-2">
        <div
          className="flex items-center gap-2 cursor-pointer py-1"
          onClick={() => toggle(node.id)}
        >
          {hasChild ? (
            <span className="text-yellow-400 text-sm">{isOpen ? "▼" : "▶"}</span>
          ) : (
            <span className="text-gray-600 text-sm">•</span>
          )}

          <div>
            <p className="text-white text-sm font-semibold">
              {node.fullname} ({node.username})
            </p>

            <p className="text-xs text-gray-400">Generation: {node.generation}</p>

            <p className="text-xs text-yellow-400">Rate: {rateDisplay}</p>

            {gotIncome ? (
              <p className="text-xs text-green-400">
                Income: {gotIncome.toFixed(2)}
              </p>
            ) : (
              <p className="text-xs text-red-400">
                Income: 0.00 — Level {node.generation} Locked. Needs {requiredDirect} directs.
              </p>
            )}
          </div>
        </div>

        {isOpen && node.children.map(c => <Node key={c.id} node={c} />)}
      </div>
    );
  };

  return (
    <div className="p-4 text-white pb-20">
      <h2 className="text-xl font-bold text-center mb-4">Your Generation History</h2>

      {/* Direct Referrals */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4">
        <p className="text-yellow-400 font-semibold">Your Direct Referrals:</p>
        <p className="text-green-400 text-lg">{directs}</p>
      </div>

      {/* Total Income */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4">
        <p className="text-yellow-400 font-semibold">Total Level Income:</p>
        <p className="text-green-400 text-lg">{income.total.toFixed(2)}</p>
      </div>

      {/* Generation Summary */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4">
        <p className="text-yellow-400 font-semibold mb-2">Generation Summary</p>

        {Object.keys(genCounts).map(g => (
          <div key={g} className="flex justify-between text-sm mb-1">
            <span>
              Gen {g}: {genCounts[g]} users
              <span className="text-yellow-400"> ({(LEVEL_RATES[g] ?? 0) * 100}%)</span>
            </span>
            <span className="text-green-400">
              {income.levels[g] ? income.levels[g].toFixed(2) : "0.00"}
            </span>
          </div>
        ))}
      </div>

      {/* TREE */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg">
        <p className="text-yellow-400 font-semibold mb-2">Your Team Tree</p>

        {tree.length === 0 ? (
          <p className="text-gray-400 text-center">No downline users.</p>
        ) : (
          tree.map(n => <Node key={n.id} node={n} />)
        )}
      </div>
    </div>
  );
}
