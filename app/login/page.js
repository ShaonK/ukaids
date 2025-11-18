"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col items-center mt-6 px-4">
      {/* Welcome back */}
      <p className="text-center text-white font-medium text-base  px-4 py-1 rounded">
        Welcome back
      </p>

      {/* Continue with Google */}
      <button className="mt-4 w-72 h-10 flex items-center justify-center rounded-md border border-gray-500 text-sm text-white cursor-pointer">
        <div className="relative w-5 h-5 mr-2">
          <Image
            src="/g.png"
            alt="Google"
            fill
            className="object-contain"
          />
        </div>
        Continue with Google
      </button>

      {/* OR */}
      <div className="mt-4 w-72 flex items-center justify-center">
        <div className="border-t border-white w-full"></div>
        <span className="px-2 text-white text-sm">OR</span>
        <div className="border-t border-white w-full"></div>
      </div>

      {/* Card */}
      <div
        className="mt-4 w-72 p-4 rounded-md relative flex flex-col items-center"
        style={{
          background: "#000000",
          border: "0.5px solid",
          borderImage:
            "linear-gradient(90deg, rgba(156,156,156,0.8) 0%, rgba(233,134,28,0.8) 49.04%, rgba(156,156,156,0.8) 100%)",
          borderImageSlice: 1,
        }}
      >
        <p className="text-[#C7C6C6] font-medium text-center mb-4">
          Login your account
        </p>

        {/* Username */}
        <label className="self-start text-[#C7C6C6] font-medium text-sm mb-1">
          Username*
        </label>
        <input
          type="text"
          placeholder="Enter your email"
          className="w-full h-9 rounded-sm border border-[#737373] bg-[#AFAEAE66] px-2 mb-3 text-black placeholder:text-black"
        />

        {/* Password */}
        <label className="self-start text-[#C7C6C6] font-medium text-sm mb-1">
          Password*
        </label>
        <div className="relative w-full mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-9 rounded-sm border border-[#737373] bg-[#AFAEAE66] px-2 text-black placeholder:text-black pr-10"
          />
          {/* Eye icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 011.174-4.625m2.626-2.03A9.96 9.96 0 0112 5c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.174 4.625m-2.626 2.03L12 12m0 0l-3.536 3.536"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Forget Password */}
        <Link
          href="/forgot-password"
          className="self-end text-[#C7C6C6] font-semibold text-sm mb-4"
        >
          Forget password?
        </Link>

        {/* Log in button */}
        <button className="w-full h-10 bg-[#3B82F6] rounded-sm flex justify-center items-center mb-2 cursor-pointer">
          <span className="text-white font-bold text-sm">Log in</span>
        </button>
      </div>

      {/* Don't have account */}
      <div className="mt-1 flex justify-end w-full px-4">
        <span className="text-white">{`Don't have an account?`}</span>
        <Link href="/Signup">
          <span className="underline font-medium text-yellow-400 ml-1 cursor-pointer">
            Sign up
          </span>
        </Link>
      </div>
    </div>
  );
}
