"use client";

import { useState, useEffect } from "react";

const COMMISSION_RATES = {
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
  const [directReferrals, setDirect] = useState(0);
  const [expanded, setExpanded] = useState({});

  function toggle(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function load() {
    const res = await fetch("/api/user/generation-tree");
    const data = await res.json();

    setTree(data.tree);
    setGenCounts(data.generationCounts);
    setIncome(data.income);
    setDirect(data.directReferrals ?? 0);
  }

  useEffect(() => {
    load();
  }, []);

  const Node = ({ node }) => {
    const hasChild = node.children.length > 0;
    const isOpen = expanded[node.id];
    const rate = COMMISSION_RATES[node.generation] ?? 0;
    const incomeFromUser = income.fromUsers[node.id] ?? 0;

    const unlocked = directReferrals >= node.generation;

    return (
      <div className="ml-4 border-l border-gray-700 pl-3 mt-2">
        <div
          className="flex items-center gap-2 cursor-pointer py-1"
          onClick={() => toggle(node.id)}
        >
          {hasChild ? (
            <span className="text-yellow-400 text-sm">
              {isOpen ? "▼" : "▶"}
            </span>
          ) : (
            <span className="text-gray-600 text-sm">•</span>
          )}

          <div>
            {/* USER NAME */}
            <p className="text-white text-sm font-semibold">
              {node.fullname} ({node.username})
            </p>

            {/* GENERATION */}
            <p className="text-xs text-gray-400">
              Generation: {node.generation}
            </p>

            {/* RATE */}
            <p className="text-xs text-yellow-400">
              Rate: {(rate * 100).toFixed(0)}%
            </p>

            {/* INCOME DISPLAY */}
            {incomeFromUser > 0 ? (
              <p className="text-xs text-green-400">
                Income: {incomeFromUser.toFixed(2)}
              </p>
            ) : (
              <p className="text-xs text-red-400">
                Income: 0.00 — Locked (Need {node.generation} directs)
              </p>
            )}
          </div>
        </div>

        {isOpen &&
          node.children.map((c) => <Node key={c.id} node={c} />)}
      </div>
    );
  };

  return (
    <div className="p-4 text-white">
      {/* PAGE TITLE */}
      <h2 className="text-xl font-bold text-center mb-4">
        Your Generation History
      </h2>

      {/* DIRECT REFERRALS CARD */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4 border border-gray-800">
        <h3 className="font-semibold text-yellow-400 mb-1">
          Your Direct Referrals
        </h3>
        <p className="text-blue-400 text-lg">{directReferrals}</p>
      </div>

      {/* TOTAL INCOME CARD */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4 border border-gray-800">
        <h3 className="font-semibold text-yellow-400 mb-1">
          Total Level Income
        </h3>
        <p className="text-green-400 text-lg">{income.total.toFixed(2)}</p>
      </div>

      {/* GENERATION SUMMARY */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4 border border-gray-800">
        <h3 className="font-semibold text-yellow-400 mb-2">
          Generation Summary
        </h3>

        {Object.keys(genCounts).map((g) => {
          const rate = COMMISSION_RATES[g] ?? 0;

          const isUnlocked = directReferrals >= g;
          const earned = income.levels[g] ?? 0;

          return (
            <div
              key={g}
              className="text-sm text-gray-300 flex justify-between mb-2"
            >
              <div>
                <span className="text-white font-semibold">
                  Gen {g}: {genCounts[g]} users
                </span>{" "}
                <span className="text-yellow-400">
                  ({(rate * 100).toFixed(0)}%)
                </span>

                {!isUnlocked && (
                  <p className="text-red-400 text-xs">
                    Unlock requires {g} direct referrals.
                  </p>
                )}
              </div>

              <span className="text-green-400 font-semibold">
                {earned.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* TREE VIEW */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
        <h3 className="font-semibold text-yellow-400 mb-2">Your Team Tree</h3>

        {tree.length === 0 ? (
          <p className="text-gray-400 text-center">No downline</p>
        ) : (
          tree.map((n) => <Node key={n.id} node={n} />)
        )}
      </div>
    </div>
  );
}
