import Card from "@/app/components/Card";

export default function UserAboutPage() {
    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-bold">About The System</h2>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    This is a demo About Us page.
                    Here you will later include details about commission, ROI,
                    referral rules, VIP ranks, and earning mechanisms.
                </p>
            </Card>
        </div>
    );
}
