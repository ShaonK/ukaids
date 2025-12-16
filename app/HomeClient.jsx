"use client";

import Image from "next/image";
import Link from "next/link";
import aboutImage from "../public/‍aboutus.png";

export default function HomeClient() {
    return (
        <>
            {/* Sticky Navbar */}
            <div
                className="w-full flex justify-between items-center px-4 py-2 sticky top-0 z-20"
                style={{
                    background:
                        "linear-gradient(90deg, #121212 10.1%, rgba(69, 46, 21, 0.5) 49.04%, #121212 93.75%)",
                }}
            >
                <Image
                    src="/logo.png"
                    alt="One Tech Logo"
                    width={100}
                    height={20}
                    className="object-contain"
                />

                <Link href="/login">
                    <span className="px-4 py-2 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                        Log in
                    </span>
                </Link>
            </div>

            {/* Hero Section */}
            <div className="relative w-full h-[365px] rounded-[12px] overflow-hidden">
                <Image
                    src="/hero-images.png"
                    alt="Hero"
                    fill
                    className="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 text-white z-10">
                    <h2 className="w-[300px] text-[28px] font-bold mt-[40px] mb-2">
                        Profit with Purpose
                    </h2>

                    <p className="text-[14px] w-[293px] mb-3 opacity-95">
                        Earn daily income, grow your network and empower real-world change.{" "}
                        <span className="text-[#C9771E] font-semibold">Learn more</span>
                    </p>

                    <div className="w-full flex justify-end pr-4 mt-2">
                        <Link href="/register">
                            <span className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium">
                                Get Started
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Progress Cards */}
            <div className="w-full flex justify-between px-3 -mt-6 relative z-30">
                {[
                    { num: "1.00k", label: "Investor" },
                    { num: "30.36k", label: "Total Deposit" },
                    { num: "1.2k", label: "Total Withdraw" },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl shadow-md px-4 py-3 flex flex-col items-center w-[32%]"
                    >
                        <h3 className="text-lg font-semibold text-black">{item.num}</h3>
                        <p className="text-[10px] text-gray-500">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* ---- rest of your page content unchanged ---- */}
            {/* About Us, Blog, Newsletter, Footer, Scroll to top button */}
            {/* window.scrollTo stays here because this is client component */}
        </>
    );
}
