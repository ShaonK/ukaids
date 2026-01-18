export default function TeamSummary({ data, totalTeam }) {
  const active = data.filter((u) => u.isActive).length;

  const totalDeposit = data.reduce(
    (sum, u) => sum + Number(u.totalDeposit || 0),
    0
  );

  // 🔹 Total generation count (dynamic)
  const totalGenerations = Math.max(
    ...data.map((u) => u.generation),
    0
  );

  return (
    <div className="mt-4 bg-[#111] p-4 rounded-lg space-y-1">
      <p>
        Total Team Members (All Generations):{" "}
        {totalTeam}
      </p>
      <p>Active Members: {active}</p>
      <p>
        Total Team Diposit: $
        {totalDeposit.toFixed(2)}
      </p>

      {/* 🔥 NEW */}
      <p className="text-sm text-orange-400">
        Total Generations: {totalGenerations}
      </p>
    </div>
  );
}
