import Card from "@/app/components/Card";

export default function IntroPage() {
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-bold text-gray-800">Introduction</h2>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    Welcome to the Ukaids Referral System.
                    Here you can earn from direct referrals, level incomes, ROI,
                    and many more earning streams.
                </p>
            </Card>

            <Card>
                <h3 className="font-semibold text-gray-700 mb-1">How to Earn?</h3>
                <ul className="text-gray-600 text-sm list-disc ml-4 space-y-1">
                    <li>Invite friends and earn referral commission</li>
                    <li>Receive ROI (daily income)</li>
                    <li>Earn from 5-level team income</li>
                    <li>Achieve VIP ranks for monthly salary</li>
                </ul>
            </Card>

            <Card>
                <h3 className="font-semibold text-gray-700">Your Referral Link</h3>
                <p className="bg-gray-100 p-2 rounded text-blue-700 text-sm mt-2">
                    https://ukaids.com/r/YOUR-USERNAME
                </p>
            </Card>
        </div>
    );
}
