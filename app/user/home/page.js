import Card from "@/app/components/Card";
import Button from "@/app/components/Button";

export default function HomePage() {
    return (
        <div className="space-y-4">

            {/* Wallet Overview */}
            <section className="grid grid-cols-2 gap-3">
                <Card>
                    <h3 className="text-sm font-medium text-gray-600">Main Balance</h3>
                    <p className="text-xl font-bold text-blue-600">$0.00</p>
                </Card>

                <Card>
                    <h3 className="text-sm font-medium text-gray-600">ROI Wallet</h3>
                    <p className="text-xl font-bold text-green-600">$0.00</p>
                </Card>

                <Card>
                    <h3 className="text-sm font-medium text-gray-600">Referral Wallet</h3>
                    <p className="text-xl font-bold text-purple-600">$0.00</p>
                </Card>

                <Card>
                    <h3 className="text-sm font-medium text-gray-600">Level Wallet</h3>
                    <p className="text-xl font-bold text-orange-600">$0.00</p>
                </Card>
            </section>


            {/* Quick Actions */}
            <section className="grid grid-cols-3 gap-3 mt-4">
                <Button label="Deposit" className="bg-blue-600" />
                <Button label="Withdraw" className="bg-green-600" />
                <Button label="Team" className="bg-purple-600" />
            </section>


            {/* Earnings Summary */}
            <section className="mt-4 space-y-3">
                <Card>
                    <h3 className="font-semibold text-gray-700">Today's ROI</h3>
                    <p className="text-lg font-bold text-green-600">$0.00</p>
                </Card>

                <Card>
                    <h3 className="font-semibold text-gray-700">Referral Income</h3>
                    <p className="text-lg font-bold text-blue-600">$0.00</p>
                </Card>

                <Card>
                    <h3 className="font-semibold text-gray-700">Level Income</h3>
                    <p className="text-lg font-bold text-purple-600">$0.00</p>
                </Card>

                <Card>
                    <h3 className="font-semibold text-gray-700">Salary Income</h3>
                    <p className="text-lg font-bold text-orange-600">$0.00</p>
                </Card>
            </section>


            {/* Activity Section */}
            <section className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Recent Activities
                </h3>

                <Card>
                    <p className="text-gray-500 text-sm">
                        No recent activity found.
                    </p>
                </Card>
            </section>

        </div>
    );
}
