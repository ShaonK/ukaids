"use client";

import { useState } from "react";
import registerAction from "./action";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showTransactionPassword, setShowTransactionPassword] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    referral: "",
    mobile: "",
    email: "",
    password: "",
    cpassword: "",
    tpassword: "",
    captcha: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await registerAction(form);
    setMsg(res.message);

    if (res.success) {
      window.location.href = "/login";
    }
  }

  const renderInput = (
    name,
    label,
    placeholder,
    type = "text",
    toggle = false,
    showState,
    setShowState
  ) => (
    <div className="flex flex-col w-full mb-4 relative">
      <label className="text-gray-300 text-sm mb-1">{label}</label>

      <input
        type={toggle ? (showState ? "text" : "password") : type}
        placeholder={placeholder}
        className="w-full rounded-sm border border-gray-500 bg-black/50 px-3 py-2 text-white"
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />

      {toggle && (
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
    <div className="w-full flex flex-col items-center">

      {/* Logo Section */}
      <div className="w-full h-14 bg-gradient-to-r from-black via-[#452E15] to-black flex justify-center items-center">
        <h1 className="text-2xl font-bold">
          <span className="text-yellow-500">One</span>{" "}
          <span className="text-white">Tech</span>
        </h1>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 w-11/12 max-w-md bg-black rounded-md p-6 shadow-lg border border-gray-600 border-opacity-50 flex flex-col"
      >
        <h2 className="text-center text-gray-300 font-medium mb-4">
          Register your account
        </h2>

        {renderInput("fullname", "Full Name*", "Enter full name")}
        {renderInput("username", "Username*", "Enter your username")}
        {renderInput("referral", "Referred By*", "Enter referral code")}
        {renderInput("mobile", "Mobile*", "Enter mobile number")}
        {renderInput("email", "Email*", "Enter your email", "email")}

        {renderInput(
          "password",
          "Password*",
          "Enter your password",
          "password",
          true,
          showPassword,
          setShowPassword
        )}

        {renderInput(
          "cpassword",
          "Confirm Password*",
          "Confirm your password",
          "password",
          true,
          showPassword,
          setShowPassword
        )}

        {renderInput(
          "tpassword",
          "Transaction Password*",
          "Enter transaction password",
          "password",
          true,
          showTransactionPassword,
          setShowTransactionPassword
        )}

        {/* Captcha */}
        <div className="flex justify-between items-center border p-3 rounded bg-gray-100 text-black mb-4">
          <span className="font-bold text-lg">1234</span>
          <input
            placeholder="Enter Captcha"
            className="border p-2 rounded w-32"
            value={form.captcha}
            onChange={(e) =>
              setForm({ ...form, captcha: e.target.value })
            }
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center mb-4">
          <input type="checkbox" id="privacy" className="w-4 h-4 mr-2" required />
          <label htmlFor="privacy" className="text-gray-300 text-sm">
            I Agree To The Privacy Policy
          </label>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-bold shadow-md active:scale-95"
        >
          Register
        </button>

        {msg && <p className="text-center text-red-400 mt-3">{msg}</p>}
      </form>

      {/* Bottom Text */}
      <div className="mt-4 w-11/12 max-w-md flex justify-end text-sm text-gray-300">
        Already have an account?
        <Link href="/login">
          <span className="ml-1 underline text-yellow-400 font-medium">Log in</span>
        </Link>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-center text-gray-400 text-xs lowercase">
        COPYRIGHT 2025 ukaids.com ALL RIGHTS RESERVED.
      </p>
    </div>
  );
}
