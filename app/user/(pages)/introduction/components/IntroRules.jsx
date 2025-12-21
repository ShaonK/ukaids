"use client";

const rules = [
    "Deposits require manual admin approval.",
    "Only active IDs are eligible for earnings and commissions.",
    "ROI operates under fixed working days and system limits.",
    "Referral and team income depend on eligibility and activity.",
    "System parameters can be updated by administrators when required.",
];

export default function IntroRules() {
    return (
        <div className="px-4 mt-6">
            <h2 className="text-center text-[18px] font-bold text-yellow-400 mb-3">
                Important System Rules
            </h2>

            <ul className="space-y-2 text-[13px] text-gray-300">
                {rules.map((r, i) => (
                    <li key={i} className="flex gap-2">
                        <span className="text-yellow-400">•</span>
                        {r}
                    </li>
                ))}
            </ul>
        </div>
    );
}
