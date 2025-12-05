import Card from "@/app/components/Card";

export default function AdminDashboard() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Overview</h2>

            <div className="grid grid-cols-2 gap-3">
                <Card>
                    <h3 className="text-sm text-gray-600">Total Users</h3>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                </Card>

                <Card>
                    <h3 className="text-sm text-gray-600">Active Deposits</h3>
                    <p className="text-2xl font-bold text-green-600">0</p>
                </Card>

                <Card>
                    <h3 className="text-sm text-gray-600">Pending Deposits</h3>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                </Card>

                <Card>
                    <h3 className="text-sm text-gray-600">Total Withdraws</h3>
                    <p className="text-2xl font-bold text-purple-600">0</p>
                </Card>
            </div>
        </div>
    );
}
