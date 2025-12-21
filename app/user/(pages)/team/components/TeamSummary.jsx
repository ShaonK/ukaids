export default function TeamSummary({ data, totalTeam }) {
  const active = data.filter((u) => u.isActive).length;
  const totalIncome = data.reduce((a, b) => a + b.totalIncome, 0);

  return (
    <div className="mt-4 bg-[#111] p-4 rounded-lg space-y-1">
      <p>Total Team Members (All Generations): {totalTeam}</p>
      <p>Active Members: {active}</p>
      <p>Total Team Income: ${totalIncome}</p>
    </div>
  );
}
