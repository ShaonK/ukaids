import Card from "@/app/components/Card";

export default function SettingsPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Settings</h2>

            <Card>
                <h3 className="font-semibold">ROI Percentage</h3>
                <p className="text-sm text-gray-600">Current: 2%</p>
            </Card>

            <Card>
                <h3 className="font-semibold">Referral Commissions</h3>
                <p className="text-sm text-gray-600">L1: 10%, L2: 3%, L3: 2%</p>
            </Card>

            <Card>
                <h3 className="font-semibold">Ranks & Salary</h3>
                <p className="text-sm text-gray-600">Editable in future steps</p>
            </Card>
        </div>
    );
}
