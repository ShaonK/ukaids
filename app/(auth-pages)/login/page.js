"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import loginAction from "./action";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", captcha: "" });
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleLogin() {
    const fd = new FormData();
    fd.append("username", form.username);
    fd.append("password", form.password);
    fd.append("captcha", form.captcha);

    const res = await loginAction(fd);

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/user");
    }
  }

  return (
    <div className="w-full flex flex-col items-center mt-6 px-4">
      {/* Welcome back */}
      <p className="text-center text-white font-medium text-base px-4 py-1 rounded">
        Welcome back
      </p>

      {/* Continue with Google */}
      <button className="mt-4 w-72 h-10 flex items-center justify-center rounded-md border border-gray-500 text-sm text-white cursor-pointer">
        <div className="relative w-5 h-5 mr-2">
          <Image src="/g.png" alt="Google" fill className="object-contain" />
        </div>
        Continue with Google
      </button>

      {/* OR */}
      <div className="mt-4 w-72 flex items-center justify-center">
        <div className="border-t border-white w-full"></div>
        <span className="px-2 text-white text-sm">OR</span>
        <div className="border-t border-white w-full"></div>
      </div>

      {/* LOGIN CARD */}
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
          placeholder="Enter your username"
          className="w-full h-9 rounded-sm border border-[#737373] bg-[#AFAEAE66] px-2 mb-3 text-black placeholder:text-black"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        {/* Password */}
        <label className="self-start text-[#C7C6C6] font-medium text-sm mb-1">
          Password*
        </label>
        <div className="relative w-full mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-9 rounded-sm border border-[#737373] bg-[#AFAEAE66] px-2 text-black placeholder:text-black pr-10"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Eye icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Captcha */}
        <label className="self-start text-[#C7C6C6] font-medium text-sm mb-1">
          Captcha*
        </label>
        <input
          placeholder="Type: 1234"
          className="w-full h-9 rounded-sm border border-[#737373] bg-[#AFAEAE66] px-2 mb-3 text-black placeholder:text-black"
          onChange={(e) => setForm({ ...form, captcha: e.target.value })}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Log in button */}
        <button
          onClick={handleLogin}
          className="w-full h-10 bg-[#3B82F6] rounded-sm flex justify-center items-center mb-2 cursor-pointer active:scale-95"
        >
          <span className="text-white font-bold text-sm">Log in</span>
        </button>
      </div>

      {/* Don't have account */}
      <div className="mt-1 flex justify-end w-full px-4">
        <span className="text-white">{`Don't have an account?`}</span>
        <Link href="/register">
          <span className="underline font-medium text-yellow-400 ml-1 cursor-pointer">
            Sign up
          </span>
        </Link>
      </div>
    </div>
  );
}
