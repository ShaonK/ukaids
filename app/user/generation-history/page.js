"use client";

import { useState, useEffect } from "react";

const COMMISSION_RATES = {
  1: 0.05,
  2: 0.04,
  3: 0.03,
  4: 0.02,
  5: 0.01,
  default: 0
};

const UNLOCK_RULE = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5
};

export default function GenerationHistoryPage() {
  const [tree, setTree] = useState([]);
  const [genCounts, setGenCounts] = useState({});
  const [income, setIncome] = useState({ total: 0, levels: {}, fromUsers: {} });
  const [directReferrals, setDirectReferrals] = useState(0);
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
    setDirectReferrals(data.directReferrals);
  }

  useEffect(() => {
    load();
  }, []);

  const Node = ({ node }) => {
    const isOpen = expanded[node.id];
    const hasChild = node.children.length > 0;

    const rate = COMMISSION_RATES[node.generation] ?? 0;
    const unlockNeed = UNLOCK_RULE[node.generation] ?? 999;
    const unlocked = directReferrals >= unlockNeed;

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
            <p className="text-white text-sm font-semibold">
              {node.fullname} ({node.username})
            </p>

            <p className="text-xs text-gray-400">
              Generation: {node.generation}
            </p>

            <p className="text-xs text-yellow-400">
              Rate: {(rate * 100).toFixed(0)}%
            </p>

            {unlocked ? (
              income.fromUsers[node.id] && (
                <p className="text-xs text-green-400">
                  Income: {income.fromUsers[node.id].toFixed(2)}
                </p>
              )
            ) : (
              <p className="text-xs text-red-400">
                Need {unlockNeed} directs to unlock
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

      {/* DIRECT REFERRALS */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4 border border-gray-800">
        <h3 className="font-semibold text-yellow-400 mb-1">
          Your Direct Referrals: {directReferrals}
        </h3>

        {directReferrals === 0 && (
          <p className="text-red-400 text-sm">
            You need at least 1 direct referral to unlock level income.
          </p>
        )}
      </div>

      {/* TOTAL INCOME */}
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
          const unlockNeed = UNLOCK_RULE[g];
          const unlocked = directReferrals >= unlockNeed;

          return (
            <div key={g} className="text-sm text-gray-300 flex justify-between mb-1">
              <span>
                Gen {g}: {genCounts[g]} users{" "}
                <span className="text-yellow-400">
                  ({(rate * 100).toFixed(0)}%)
                </span>
                {!unlocked && (
                  <span className="text-red-400 ml-2">
                    (Need {unlockNeed} directs)
                  </span>
                )}
              </span>

              <span className="text-green-400">
                {income.levels[g] ? income.levels[g].toFixed(2) : "0.00"}
              </span>
            </div>
          );
        })}
      </div>

      {/* TEAM TREE */}
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
