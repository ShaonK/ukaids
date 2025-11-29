"use client";

export default function EarningsOverview() {
  const row1 = [
    { title: "Today's Earnings", value: "10$" },
    { title: "Yesterday's Earnings", value: "25$" },
    { title: "Recommended Income", value: "10$" },
  ];

  const row2 = [
    { title: "Earnings This WEEK", value: "10$" },
    { title: "Earnings This Month", value: "25$" },
    { title: "Task Commission from the team", value: "10$" },
  ];

  const row3 = [
    { title: "Job Security Deposit", value: "25$" },
    { title: "Total Revenue", value: "25$" },
  ];

  const Card = ({ title, value }) => (
    <div
      className="
        rounded-lg p-[1px]
        bg-[linear-gradient(180deg,#3B82F6,#EC7B03)]
        overflow-hidden
      "
    >
      <div
        className="
          bg-[#121212]
          h-[90px]
          flex flex-col items-center justify-center
          rounded-lg px-2 py-2
          text-center
        "
      >
        <p className="text-[12px] font-semibold text-[#E07503] leading-snug text-center">
          {title}
        </p>
        <p className="text-[18px] mt-1 font-bold text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full mt-6 space-y-4">

      {/* Row 1: 3 cards */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {row1.map((item, i) => (
          <Card key={i} title={item.title} value={item.value} />
        ))}
      </div>

      {/* Row 2: 3 cards */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {row2.map((item, i) => (
          <Card key={i} title={item.title} value={item.value} />
        ))}
      </div>

      {/* Row 3: 2 cards centered */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {row3.map((item, i) => (
          <Card key={i} title={item.title} value={item.value} />
        ))}
      </div>

    </div>
  );
}
