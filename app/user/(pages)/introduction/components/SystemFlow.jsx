"use client";

const steps = [
    {
        title: "Account Registration",
        desc: "Create your account. One user is allowed to maintain only one account.",
    },
    {
        title: "Deposit & Activation",
        desc: "Make a deposit via USDT (TRC20). Deposits are reviewed and approved manually by admin. Once approved, your ID becomes active.",
    },
    {
        title: "ROI & Earnings",
        desc: "ROI is generated based on active deposits under predefined system rules and working days.",
    },
    {
        title: "Referral & Team System",
        desc: "Invite others and build your team. Team earnings depend on eligibility and active referrals.",
    },
    {
        title: "Wallet & Withdraw",
        desc: "All earnings are recorded in separate wallets for transparency. Withdrawals are processed manually.",
    },
];

export default function SystemFlow() {
    return (
        <div className="px-4 mt-6">
            <h2 className="text-center text-[20px] font-bold text-yellow-400 mb-4">
                How the System Works
            </h2>

            <div className="space-y-4">
                {steps.map((s, i) => (
                    <div
                        key={i}
                        className="bg-[#111] border border-[#2A2A2A] p-4 rounded-lg"
                    >
                        <h3 className="text-[15px] font-semibold text-yellow-300 mb-1">
                            Step {i + 1}: {s.title}
                        </h3>
                        <p className="text-[13px] text-gray-300 leading-5">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
