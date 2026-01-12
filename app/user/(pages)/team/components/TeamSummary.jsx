export default function TeamSummary({ data, totalTeam }) {
  const active = data.filter((u) => u.isActive).length;

  // ✅ SAFE TOTAL INCOME CALCULATION
  const totalIncome = data.reduce(
    (sum, u) => sum + Number(u.totalIncome || 0),
    0
  );

  return (
    <div className="mt-4 bg-[#111] p-4 rounded-lg space-y-1">
      <p>Total Team Members (All Generations): {totalTeam}</p>
      <p>Active Members: {active}</p>
      <p>Total Team Income: ${totalIncome.toFixed(2)}</p>
    </div>
  );
}
