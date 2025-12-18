"use client";

import Image from "next/image";
import Link from "next/link";

const stats = [
    { num: "1.0k+", label: "Investors" },
    { num: "$30k+", label: "Total Deposit" },
    { num: "$12k+", label: "Total Withdraw" },
];

const plans = [
    {
        name: "Starter",
        price: "$25",
        desc: "Start small and earn daily fixed ROI.",
    },
    {
        name: "Growth",
        price: "$100",
        desc: "Higher capital with better daily income.",
    },
    {
        name: "Premium",
        price: "$500",
        desc: "Maximum earning & referral benefits.",
    },
];

export default function HomeClient() {
    return (
        <div className="mx-auto w-[360px] min-h-screen bg-[#121212] text-white">

            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3
        bg-gradient-to-r from-black via-[#2b1a09] to-black">
                <Image src="/logo.png" alt="UKAIDS" width={100} height={30} />
                <Link href="/login" className="text-sm font-medium text-white hover:text-orange-400">
                    Login
                </Link>
            </header>

            {/* ================= HERO ================= */}
            <section className="relative h-[340px]">
                <Image
                    src="/hero-images.png"
                    alt="Hero"
                    fill
                    className="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-black/70" />

                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
                    <h1 className="text-2xl font-bold mb-2">
                        Profit with Purpose
                    </h1>
                    <p className="text-sm text-gray-300 mb-4">
                        Earn daily income & build a powerful referral network.
                    </p>

                    <Link
                        href="/register"
                        className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-2 rounded-md font-semibold"
                    >
                        Get Started
                    </Link>
                </div>
            </section>

            {/* ================= STATS ================= */}
            <section className="flex justify-between gap-2 px-3 -mt-8 relative z-20">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-white text-black rounded-xl p-3 text-center shadow"
                    >
                        <p className="font-bold">{s.num}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                ))}
            </section>

            {/* ================= PLANS ================= */}
            <section className="px-4 mt-10">
                <h2 className="text-xl font-bold text-center mb-2">
                    Choose Your Plan
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                    Start earning with the plan that fits you best.
                </p>

                <div className="space-y-4">
                    {plans.map((p, i) => (
                        <div
                            key={i}
                            className="border border-orange-500/40 rounded-xl p-4 text-center"
                        >
                            <h3 className="text-lg font-semibold">{p.name}</h3>
                            <p className="text-2xl font-bold text-orange-400 mt-1">
                                {p.price}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">{p.desc}</p>

                            <Link
                                href="/register"
                                className="block mt-4 bg-orange-500 text-black py-2 rounded-md font-semibold"
                            >
                                Invest Now
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="px-4 mt-12">
                <h2 className="text-xl font-bold text-center mb-6">
                    How It Works
                </h2>

                <div className="space-y-4">
                    {[
                        "Create your free account",
                        "Choose an investment plan",
                        "Deposit & activate package",
                        "Earn daily ROI & referral income",
                    ].map((step, i) => (
                        <div
                            key={i}
                            className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm"
                        >
                            {i + 1}. {step}
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= ABOUT ================= */}
            <section className="px-4 mt-12">
                <h2 className="text-xl font-bold text-center mb-4">
                    About UKAIDS
                </h2>

                <div className="bg-[#1a1a1a] rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
                    UKAIDS is a UK-based humanitarian initiative focused on sustainable
                    development, community empowerment, and ethical investment
                    opportunities worldwide.
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="mt-12 pb-10 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} UKAIDS. All rights reserved.
            </footer>
        </div>
    );
}
