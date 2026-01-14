"use client";

import { useEffect, useState } from "react";
import { formatRank } from "@/lib/rankFormatter";

export default function RankEligiblePage() {
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [candidateUsers, setCandidateUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/rank/eligible", {
      cache: "no-store",
    });

    const data = await res.json();

    setEligibleUsers(data.eligibleUsers || []);
    setAssignedUsers(data.assignedUsers || []);
    setCandidateUsers(data.candidateUsers || []);
    setLoading(false);
  }

  async function toggleRank(user, turnOn) {
    await fetch("/api/admin/rank/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminId: 1, // later real admin id
        userId: user.userId,
        rank: user.eligibleRank,
        enabled: turnOn,
      }),
    });

    loadUsers();
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <p className="p-4 text-gray-400">Loading…</p>;
  }

  return (
    <div className="p-3 max-w-[420px] mx-auto space-y-4">
      {/* HEADER */}
      <h1 className="text-xl font-bold flex items-center gap-2">
        ⭐ Rank Eligible Users
      </h1>

      {/* SUMMARY */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>• Eligible: <b>{eligibleUsers.length}</b></p>
        <p>• Assigned: <b>{assignedUsers.length}</b></p>
        <p>• Candidates: <b>{candidateUsers.length}</b></p>
      </div>

      {/* ================= ELIGIBLE USERS ================= */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-green-700">
          ✅ Eligible (Not Assigned)
        </h2>

        {eligibleUsers.length === 0 && (
          <p className="text-xs text-gray-400">No eligible users</p>
        )}

        {eligibleUsers.map((u) => (
          <div
            key={u.userId}
            className="border rounded-lg p-2 bg-white"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm">{u.username}</p>
            </div>

            <div className="flex justify-between mt-1 text-xs">
              <div>
                <span className="text-gray-500 block">Eligible Rank</span>
                <span className="font-bold text-orange-600">
                  {formatRank(u.eligibleRank)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-gray-500 block">Team</span>
                <span className="font-semibold">{u.teamCount}</span>
              </div>
            </div>

            {/* TOGGLE */}
            <button
              onClick={() => toggleRank(u, true)}
              className="mt-2 w-full py-1.5 rounded-md text-sm font-semibold
              bg-green-500 hover:bg-green-400 text-black"
            >
              Toggle ON
            </button>
          </div>
        ))}
      </section>

      {/* ================= ASSIGNED USERS ================= */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-blue-700">
          🟢 Assigned Ranks
        </h2>

        {assignedUsers.length === 0 && (
          <p className="text-xs text-gray-400">No assigned users</p>
        )}

        {assignedUsers.map((u) => (
          <div
            key={u.userId}
            className="border rounded-lg p-2 bg-green-50"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm">{u.username}</p>

              <span className="text-[10px] px-2 py-0.5 rounded-full
                bg-green-200 text-green-800 font-semibold">
                Assigned
              </span>
            </div>

            <div className="flex justify-between mt-1 text-xs">
              <div>
                <span className="text-gray-500 block">Rank</span>
                <span className="font-bold text-green-700">
                  {formatRank(u.rank)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-gray-500 block">Team</span>
                <span className="font-semibold">{u.teamCount}</span>
              </div>
            </div>

            <button
              onClick={() => toggleRank(u, false)}
              className="mt-2 w-full py-1.5 rounded-md text-sm font-semibold
              bg-red-400 hover:bg-red-300 text-black"
            >
              Toggle OFF
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
