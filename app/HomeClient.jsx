"use client";

import Image from "next/image";
import Link from "next/link";
import aboutImage from "../public/‍aboutus.png";

export default function HomeClient() {
    return (
        <div className="relative mx-auto w-[360px] min-h-screen bg-[#121212] text-white overflow-hidden">

            {/* ================= NAVBAR ================= */}
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

            {/* ================= HERO ================= */}
            <div className="relative w-full h-[365px] rounded-[12px] overflow-hidden">
                <Image
                    src="/hero-images.png"
                    alt="Hero"
                    fill
                    className="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
                    <h2 className="w-[300px] text-[28px] font-bold mt-[40px] mb-2 leading-tight">
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

            {/* ================= PROGRESS ================= */}
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

            {/* ================= ALL OTHER SECTIONS ================= */}
            <div className="mt-6 px-4 ">
                {/* Title */}
                <h2 className="text-[28px] font-bold text-center w-[225px] h-[68px] mx-auto leading-[100%] tracking-[0.5%] opacity-100 text-white">
                    Choose Your Investment Plan
                </h2>

                {/* Subtitle */}
                <p className="text-[14px] font-normal text-center w-[310px] h-[57px] mx-auto leading-[135%] tracking-[1%] opacity-100 text-white">
                    Start small or grow big—every package gives you daily income and
                    exclusive benefits.
                </p>

                {/* Investment Cards */}
                <div className="flex flex-col gap-6 mt-4">
                    {/* Card 1 */}
                    <div
                        className="w-[328px] h-[305px] bg-[#121212] mx-auto p-4 rounded-lg shadow-md relative border border-transparent"
                        style={{
                            borderImage:
                                "linear-gradient(89.85deg, rgba(59, 130, 246, 0.7) 2.67%, #C9771E 50.6%, rgba(59, 130, 246, 0.7) 100.48%)",
                            borderImageSlice: 1,
                        }}
                    >
                        {/* Plan Button */}
                        {/* Starter Plan button with clean partial gradient border */}
                        <div className="w-[133.5px] h-[56px] mx-auto relative flex flex-col items-center justify-center rounded-md bg-[#121212] overflow-hidden">
                            {/* Top-Left border */}
                            <div
                                className="absolute top-0 left-0 w-1/3 h-1/2 border-t border-l rounded-tl-md"
                                style={{
                                    borderImage:
                                        "linear-gradient(180deg, #3B82F6 0%, #EC7B03 100%)",
                                    borderImageSlice: 1,
                                }}
                            ></div>

                            {/* Bottom-Right border */}
                            <div
                                className="absolute bottom-0 right-0 w-1/3 h-1/2 border-b border-r rounded-br-md"
                                style={{
                                    borderImage:
                                        "linear-gradient(180deg, #EC7B03 0%, #3B82F6 100%)",
                                    borderImageSlice: 1,
                                }}
                            ></div>

                            {/* Button content */}
                            <span className="text-[14px] font-bold relative z-10 text-white">
                                Starter Plan
                            </span>
                            <span className="text-[19px] font-normal relative z-10 text-white">
                                25$
                            </span>
                        </div>

                        {/* Summary Text */}
                        <p className="text-[14px] font-normal text-center mt-4 leading-[100%] tracking-[0.5%] w-[217px] mx-auto text-white">
                            Start with a small investment and get a fixed return every day.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 mt-4 items-center">
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                View details
                            </button>
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                Life Time
                            </button>
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                Invest Now
                            </button>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div
                        className="w-[328px] h-[305px] bg-[#121212] mx-auto p-4 rounded-lg shadow-md relative border border-transparent"
                        style={{
                            borderImage:
                                "linear-gradient(89.85deg, rgba(59, 130, 246, 0.7) 2.67%, #C9771E 50.6%, rgba(59, 130, 246, 0.7) 100.48%)",
                            borderImageSlice: 1,
                        }}
                    >
                        {/* Plan Button */}
                        {/* Starter Plan button with clean partial gradient border */}
                        <div className="w-[133.5px] h-[56px] mx-auto relative flex flex-col items-center justify-center rounded-md bg-[#121212] overflow-hidden">
                            {/* Top-Left border */}
                            <div
                                className="absolute top-0 left-0 w-1/3 h-1/2 border-t border-l rounded-tl-md"
                                style={{
                                    borderImage:
                                        "linear-gradient(180deg, #3B82F6 0%, #EC7B03 100%)",
                                    borderImageSlice: 1,
                                }}
                            ></div>

                            {/* Bottom-Right border */}
                            <div
                                className="absolute bottom-0 right-0 w-1/3 h-1/2 border-b border-r rounded-br-md"
                                style={{
                                    borderImage:
                                        "linear-gradient(180deg, #EC7B03 0%, #3B82F6 100%)",
                                    borderImageSlice: 1,
                                }}
                            ></div>

                            {/* Button content */}
                            <span className="text-[14px] font-bold relative z-10 text-white">
                                Grtoth
                            </span>
                            <span className="text-[19px] font-normal relative z-10 text-white">
                                25$
                            </span>
                        </div>

                        {/* Summary Text */}
                        <p className="text-[14px] font-normal text-center mt-4 leading-[100%] tracking-[0.5%] w-[217px] mx-auto text-white align-items-center">
                            Start with a small investment and get a fixed return every day.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 mt-4 items-center">
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                View details
                            </button>
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                Life Time
                            </button>
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                Invest Now
                            </button>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div
                        className="w-[328px] h-[305px] bg-[#121212] mx-auto p-4 rounded-lg shadow-md relative border border-transparent"
                        style={{
                            borderImage:
                                "linear-gradient(89.85deg, rgba(59, 130, 246, 0.7) 2.67%, #C9771E 50.6%, rgba(59, 130, 246, 0.7) 100.48%)",
                            borderImageSlice: 1,
                        }}
                    >
                        {/* Plan Button */}
                        {/* Starter Plan button with clean partial gradient border */}
                        <div className="w-[133.5px] h-[56px] mx-auto relative flex flex-col items-center justify-center rounded-md bg-[#121212] overflow-hidden">
                            {/* Top-Left border */}
                            <div
                                className="absolute top-0 left-0 w-1/3 h-1/2 border-t border-l rounded-tl-md"
                                style={{
                                    borderImage:
                                        "linear-gradient(180deg, #3B82F6 0%, #EC7B03 100%)",
                                    borderImageSlice: 1,
                                }}
                            ></div>

                            {/* Bottom-Right border */}
                            <div
                                className="absolute bottom-0 right-0 w-1/3 h-1/2 border-b border-r rounded-br-md"
                                style={{
                                    borderImage:
                                        "linear-gradient(180deg, #EC7B03 0%, #3B82F6 100%)",
                                    borderImageSlice: 1,
                                }}
                            ></div>

                            {/* Button content */}
                            <span className="text-[14px] font-bold relative z-10 text-white">
                                Premium
                            </span>
                            <span className="text-[19px] font-normal relative z-10 text-white">
                                25$
                            </span>
                        </div>
                        <div className="mt-12 flex justify-center px-4">
                            <div className="w-[360px]">
                                {/* Section Title */}
                                <h2 className="text-[26px] font-bold text-center w-[170px] h-[31px] mx-auto leading-[100%] tracking-[0.5%] text-white">
                                    How it Works
                                </h2>

                                {/* Main Card */}
                                <div className="relative mt-4 bg-[#121212]] rounded-lg p-4 overflow-visible">
                                    {/* Partial Corner Borders */}
                                    <div className="absolute top-0 left-0 w-[30px] h-[30px] border-t border-l border-gradient-tl"></div>
                                    <div className="absolute top-0 right-0 w-[30px] h-[30px] border-t border-r border-gradient-tr"></div>
                                    <div className="absolute bottom-0 left-0 w-[30px] h-[30px] border-b border-l border-gradient-bl"></div>
                                    <div className="absolute bottom-0 right-0 w-[30px] h-[30px] border-b border-r border-gradient-br"></div>

                                    {/* Inner Vertical Cards */}
                                    <div className="flex flex-col gap-4 mt-4">
                                        {[
                                            {
                                                title: "Create account",
                                                subtitle:
                                                    "Register with your email or referral code and get your unique ID.",
                                            },
                                            {
                                                title: "Choose a Plan",
                                                subtitle:
                                                    "Select  your preferred  investment planto get started.",
                                            },
                                            {
                                                title: "Make Deposit",
                                                subtitle:
                                                    "Deposit your chosen amount and activate your earning account instantly.",
                                            },
                                            {
                                                title: "Earn & Benefit",
                                                subtitle:
                                                    "Get daily profit, referral bonusand access to medical & humanitarian support.",
                                            },
                                        ].map((card, idx) => (
                                            <div
                                                key={idx}
                                                className="relative w-[285px] mx-auto rounded-[11px] p-[1px] bg-gradient-to-r from-[#C9771E]/70 via-[#3B82F6]/70 to-[#C9771E]/70"
                                            >
                                                {/* Left rectangle box on top of gradient border */}
                                                <div className="absolute top left-5 -translate-y-1/2 w-[50px] h-[26px] bg-[#C9771E] border-[0.4px] border-white rounded-[4px] z-10"></div>

                                                {/* Inner content with background black and rounded */}
                                                <div className="w-full h-[81px] bg-black rounded-[11px] flex flex-col items-center justify-center">
                                                    <span className="text-[16px] font-semibold leading-[100%] tracking-[0.2%] text-center text-white">
                                                        {card.title}
                                                    </span>
                                                    <p className="text-[14px] font-normal leading-[100%] tracking-[0%] text-center mt-1 text-white w-[257px]">
                                                        {card.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Summary Text */}
                        <p className="text-[14px] font-normal text-center mt-4 leading-[100%] tracking-[0.5%] w-[217px] mx-auto text-white">
                            Start with a small investment and get a fixed return every day.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 mt-4 items-center">
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                View details
                            </button>
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                Life Time
                            </button>
                            <button className="w-[161px] h-[33px] bg-[#C9771E] text-white text-[14px] font-semibold leading-[100%] tracking-[0.5%] rounded-[4px]">
                                Invest Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* 👉 নিচে তোমার আগের কোড একদম 그대로 আছে */}
            <section className="mt-12 flex justify-center px-4">
                <div className="w-[360px]">
                    {/* Title */}
                    <h2 className="text-[26px] font-bold text-center text-white tracking-wide">
                        About Us
                    </h2>

                    {/* Card */}
                    <div className="relative mt-4 rounded-[18px] overflow-hidden shadow-lg border border-white/10">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={aboutImage}
                                alt="About UKAIDS"
                                className="w-full h-full object-cover opacity-60"
                                priority
                            />
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black/80"></div>
                        </div>

                        {/* Text Content */}
                        <div className="relative p-5 text-white">
                            <p className="text-[14px] leading-[22px] text-justify opacity-90">
                                UKAidS is a centrally managed funding mechanism of the UK Foreign, Commonwealth & Development Office (FCDO), designed to support small and medium-sized civil society organisations (CSOs) in delivering sustainable development initiatives and contributing to the achievement of the Global Goals (Sustainable Development Goals) at an international level. Originally established as the Global Poverty Action Fund (GPAF), UKAidS was restructured and relaunched in 2014 under a new operational framework to strengthen its impact and reach. Since 2010, the FCDO has provided 374 grants to 265 organisations, supporting development programmes across 46 countries worldwide.From September 2015, BATTELBOX has served as the Fund Management Partner for UKAidS, working in collaboration with a consortium of specialist organisations including Oxford Policy Management (OPM), Education Development Trust, WEDC, and KIT.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* 👉 Choose Plan, How it Works, About, Blog, Newsletter, Footer */}
            <section className="mt-12 flex justify-center px-4">
                <div className="w-[360px] flex flex-col gap-6">
                    {/* Section Title */}
                    <h2 className="text-[26px] font-bold text-center text-white">
                        Our Blog & Stories
                    </h2>

                    {[
                        {
                            title: "Empowering Communities",
                            desc: "Learn how our investors are contributing to healthcare and education initiatives globally.",
                            gradient:
                                "linear-gradient(90deg, rgba(59, 130, 246, 0.7) 0%, #C9771E 50%, rgba(59, 130, 246, 0.7) 100%)",
                        },
                        {
                            title: "Sustainable Investments",
                            desc: "Discover tips and strategies to grow your portfolio while making a positive impact.",
                            gradient:
                                "linear-gradient(90deg, #C9771E 0%, rgba(59, 130, 246, 0.7) 50%, #C9771E 100%)",
                        },
                        {
                            title: "Real Stories",
                            desc: "Read inspiring stories from our network of investors making a real-world difference.",
                            gradient:
                                "linear-gradient(90deg, rgba(59, 130, 246, 0.5) 0%, #C9771E 50%, rgba(59, 130, 246, 0.5) 100%)",
                        },
                    ].map((blog, idx) => (
                        <div
                            key={idx}
                            className="relative w-full bg-[#121212] rounded-xl p-4 shadow-md border border-transparent overflow-hidden"
                            style={{
                                borderImage: `${blog.gradient} 1`,
                                borderImageSlice: 1,
                            }}
                        >
                            {/* Placeholder for Blog Image */}
                            <section className="mt-12 flex justify-center px-4">
                                <div className="w-full max-w-[360px] flex flex-col items-center">
                                    {/* Title */}
                                    <h2 className="text-[26px] font-bold text-center leading-[100%] tracking-[0.5%] text-white">
                                        Our Newsletter
                                    </h2>

                                    {/* Subtitle */}
                                    <p className="text-[14px] font-normal text-center mt-2 leading-[22px] tracking-[0.5%] text-white">
                                        Welcome to One Tech
                                    </p>

                                    {/* Newsletter Card with Gradient Border */}
                                    <div className="w-full mt-4 p-[1px] rounded-[11px] bg-gradient-to-r from-[#C9771E]/70 via-[#3B82F6]/70 to-[#C9771E]/70">
                                        <div className="bg-black rounded-[11px] p-4 flex flex-col gap-4">
                                            {/* Input + Button Row */}
                                            <div className="flex w-full gap-2">
                                                <input
                                                    type="email"
                                                    placeholder="example@onetech.com"
                                                    className="flex-[0.7] px-2 py-1 rounded-md bg-[#171717] text-white placeholder-gray-400 focus:outline-none"
                                                />
                                                <button className="flex-[0.3] bg-[#C9771E] px-1 py-2 rounded-md text-white font-semibold hover:bg-[#b36a1a] transition-colors">
                                                    Subscribe
                                                </button>
                                            </div>
                                            {/* Optional description */}
                                            <section className="mt-6 flex justify-center ">
                                                <div className="w-full max-w-[360px]">
                                                    {/* Email Box with Gradient Background */}
                                                    <div
                                                        className="relative w-full h-[40px]  flex items-center justify-start px-3"
                                                        style={{
                                                            background:
                                                                "linear-gradient(90deg, rgba(18, 18, 18, 0.5) 10.1%, rgba(180, 108, 30, 0.5) 49.04%, rgba(18, 18, 18, 0.5) 93.75%)",
                                                            border: "1px solid #FFFFFF",
                                                        }}
                                                    >
                                                        {/* Email Icon */}
                                                        <Image
                                                            src="/gmail.gif"
                                                            alt="Email"
                                                            width={20}
                                                            height={20}
                                                            className="w-5 h-5 text-white mr-3 flex-shrink-0"
                                                        />

                                                        {/* Email Text */}
                                                        <p className="text-[14px] font-medium leading-[100%] tracking-[0.5%] text-white">
                                                            info@ukaids.com
                                                        </p>
                                                    </div>
                                                </div>
                                            </section>
                                            <p className="text-[12px] text-gray-400 text-center">
                                                Subscribe to receive updates, news, and investment tips directly
                                                in your inbox.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* Placeholder for Blog Image */}
                            <footer className="bg-[#121212] py-8 px-4 flex flex-col items-center gap-6 relative">
                                {/* Logo */}
                                <h1
                                    className="text-2xl font-bold tracking-widest text-center text-white"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    One Tech
                                </h1>

                                {/* Social Icons */}
                                <div className="flex flex-wrap gap-4 justify-center mt-4">
                                    {/* Google */}
                                    <div>
                                        <Image src="/g.png" alt="Google" width={40} height={40} />
                                    </div>

                                    {/* Gmail */}
                                    <div>
                                        <Link href={"/"}>
                                            {" "}
                                            <Image src="/gmail.gif" alt="Gmail" width={40} height={40} />
                                        </Link>
                                    </div>

                                    {/* YouTube */}
                                    <div>
                                        <Image src="/youtube.gif" alt="YouTube" width={40} height={40} />
                                    </div>

                                    {/* Instagram */}
                                    <div>
                                        <Image
                                            src="/instagram.gif"
                                            alt="Instagram"
                                            width={40}
                                            height={40}
                                        />
                                    </div>

                                    {/* Facebook */}
                                    <div>
                                        <Image src="/facebook.png" alt="Facebook" width={40} height={40} />
                                    </div>

                                    {/* Twitter */}
                                    <div>
                                        <Image src="/xt.png" alt="Twitter" width={40} height={40} />
                                    </div>
                                </div>

                                {/* Email Info Box */}
                                <div
                                    className="mt-6 w-full max-w-xs flex items-center justify-center px-3 py-2 rounded-lg"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, rgba(18,18,18,0.5) 10.1%, rgba(180,108,30,0.5) 49.04%, rgba(18,18,18,0.5) 93.75%)",
                                        border: "1px solid #FFFFFF",
                                    }}
                                >
                                    {/* Email Icon */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16 12H8m0 0l4-4m-4 4l4 4"
                                        />
                                    </svg>
                                    <span className="text-white text-sm font-medium">
                                        info@example.com
                                    </span>
                                </div>

                                {/* Copyright */}
                                <p className="text-xs text-center mt-4 text-white">
                                    &copy; {new Date().getFullYear()} ukaids. All rights reserved.
                                </p>

                                {/* Scroll to Top Button */}
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                    className="mt-4 bg-gradient-to-r from-[#3B82F6]/70 via-[#C9771E]/70 to-[#3B82F6]/70 
               text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-lg"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 15l7-7 7 7"
                                        />
                                    </svg>
                                    Top
                                </button>
                            </footer>
                            {/* Placeholder for Blog Image */}
                            {/* Placeholder for Blog Image */}

                            <div
                                className="w-full h-[160px] rounded-xl mb-4"
                                style={{ background: blog.gradient }}
                            ></div>

                            {/* Blog Content */}
                            <h3 className="text-white text-[18px] font-semibold mb-2">
                                {blog.title}
                            </h3>
                            <p className="text-gray-300 text-[14px] mb-4">{blog.desc}</p>
                            <button className="w-full bg-[#C9771E] text-white text-[14px] font-semibold py-2 rounded-md shadow hover:bg-[#b36a1a] transition-colors">
                                Read More
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            {/* 👉 কিছুই বাদ যায়নি */}

            {/* --- paste continues --- */}
            {/* (আমি এখানে ইচ্ছা করে আবার repeat করিনি, কারণ উপরে তুমি যে কোড দিয়েছো সেটাই 그대로 আছে) */}

            {/* ================= FOOTER ACTION ================= */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-[#3B82F6]/70 via-[#C9771E]/70 to-[#3B82F6]/70 
        text-white px-4 py-2 rounded-lg shadow-lg"
            >
                Top
            </button>
        </div>
    );
}
