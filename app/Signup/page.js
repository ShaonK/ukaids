"use client";

import React, { useState } from "react";
import SignupLayout from "./layout";
import Image from "next/image";
import Link from "next/link";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showTransactionPassword, setShowTransactionPassword] = useState(false);

  const renderInput = (
    label,
    type,
    placeholder,
    showToggle,
    showState,
    setShowState
  ) => (
    <div className="flex flex-col w-full mb-4 relative">
      <label className="text-gray-300 text-sm mb-1">{label}</label>
      <input
        type={showToggle ? (showState ? "text" : "password") : type}
        placeholder={placeholder}
        className="w-full rounded-sm border border-gray-500 bg-black/50 px-3 py-2 text-white"
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowState(!showState)}
          className="absolute right-3 top-8 text-gray-400"
        >
          {showState ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );

  return (
    <SignupLayout>
      {/* Logo Section */}
      <div className="w-full h-14 bg-gradient-to-r from-black via-[#452E15] to-black flex justify-center items-center">
        <h1 className="text-2xl font-bold">
          <span className="text-yellow-500">One</span>{" "}
          <span className="text-white">Tech</span>
        </h1>
      </div>

      {/* Card */}
      <div className="mt-6 w-11/12 max-w-md bg-black rounded-md p-6 shadow-lg border border-gray-600 border-opacity-50 flex flex-col">
        <h2 className="text-center text-gray-300 font-medium mb-4">
          Register your account
        </h2>

        {renderInput("Username*", "text", "Enter your username", false)}
        {renderInput("Referred By*", "text", "Enter referrer", false)}
        {renderInput("Country*", "text", "Enter country", false)}
        {renderInput("Email*", "email", "Enter your email", false)}
        {renderInput(
          "Password*",
          "password",
          "Enter your password",
          true,
          showPassword,
          setShowPassword
        )}
        {renderInput(
          "Confirm Password*",
          "password",
          "Confirm your password",
          true,
          showPassword,
          setShowPassword
        )}
        {renderInput(
          "Transaction Password*",
          "password",
          "Enter transaction password",
          true,
          showTransactionPassword,
          setShowTransactionPassword
        )}

        {/* Checkbox */}
        <div className="flex items-center mb-4">
          <input type="checkbox" id="privacy" className="w-4 h-4 mr-2" />
          <label htmlFor="privacy" className="text-gray-300 text-sm">
            I Agree To The Privacy Policy
          </label>
        </div>

        {/* Register Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-md font-bold shadow-md">
          Register
        </button>
      </div>

      {/* Sign up / Bottom Text */}
      <div className="mt-4 w-11/12 max-w-md flex justify-end text-sm text-gray-300">
        {"Don't have an account? "}
        <Link href="/login" >
          <span className="ml-1 underline text-yellow-400 font-medium">Log in</span>
        </Link>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-center text-gray-400 text-xs lowercase">
        COPYRIGHT 2025 Ukaids.com ALL RIGHTS RESERVED.
      </p>
    </SignupLayout>
  );
};

export default SignUpPage;
