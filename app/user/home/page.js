import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import Card from "@/app/components/Card";

export default async function HomePage() {
    const user = await getUser();

    // যদি user null হয় → redirect করা উচিত
    if (!user) {
        return (
            <div className="p-6 text-red-600">
                Unauthorized! Please login again.
            </div>
        );
    }

    const wallet = await prisma.wallet.findUnique({
        where: { userId: user.id }
    });

    if (!wallet) {
        return (
            <div className="p-6 text-red-600">
                Wallet not found! Please contact support.
            </div>
        );
    }

    return (
        <div className="space-y-4">

            <section className="grid grid-cols-2 gap-3">
                <Card>
                    <h3>Main Balance</h3>
                    <p className="text-xl font-bold text-blue-600">
                        ${wallet.mainWallet}
                    </p>
                </Card>

                <Card>
                    <h3>ROI Wallet</h3>
                    <p className="text-xl font-bold text-green-600">
                        ${wallet.roiWallet}
                    </p>
                </Card>
            </section>

        </div>
    );
}
