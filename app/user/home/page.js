import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import Card from "@/app/components/Card";   // <-- FIXED

export default async function HomePage() {
    const user = await getUser();
    const wallet = await prisma.wallet.findUnique({
        where: { userId: user.id }
    });

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
