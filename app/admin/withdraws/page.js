import Card from "@/app/components/Card";
import Button from "@/app/components/Button";

export default function WithdrawPage() {
  const items = [
    { user: "UserA", amount: 20, wallet: "TRC20-USDT" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Withdraw Requests</h2>

      {items.map((w, i) => (
        <Card key={i}>
          <h3 className="font-semibold">{w.user}</h3>
          <p className="text-sm">Amount: ${w.amount}</p>
          <p className="text-xs text-gray-600">{w.wallet}</p>

          <div className="flex gap-3 mt-3">
            <Button label="Approve" className="bg-green-600" />
            <Button label="Reject" className="bg-red-600" />
          </div>
        </Card>
      ))}
    </div>
  );
}
