"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import loginAction from "./action";

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });

  const [form, setForm] = useState({
    username: "",
    password: "",
    captchaAnswer: "",
  });

  /* --------------------
     GENERATE CAPTCHA
  -------------------- */
  useEffect(() => {
    generateCaptcha();
  }, []);

  function generateCaptcha() {
    setCaptcha({
      a: Math.floor(Math.random() * 9) + 1,
      b: Math.floor(Math.random() * 9) + 1,
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLogin() {
    setError("");

    const fd = new FormData();
    fd.append("username", form.username);
    fd.append("password", form.password);
    fd.append("captchaAnswer", form.captchaAnswer);
    fd.append("captchaSum", captcha.a + captcha.b);

    const res = await loginAction(fd);

    if (res.error) {
      setError(res.error);
      generateCaptcha();
      return;
    }

    router.push("/user");
  }

  return (
    <div className="w-full flex flex-col items-center mt-6 px-4">
      <p className="text-center text-white font-medium text-base">
        Welcome back
      </p>

      {/* Google */}
      <button className="mt-4 w-72 h-10 flex items-center justify-center rounded-md border border-gray-500 text-sm text-white">
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
      <div className="mt-4 w-72 p-4 rounded-md flex flex-col bg-black border border-gray-600">
        <p className="text-[#C7C6C6] text-center mb-4 font-medium">
          Login your account
        </p>

        {/* Username */}
        <label className="text-sm text-gray-300 mb-1">Username*</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          className="w-full h-9 mb-3 rounded border bg-gray-200 px-2 text-black"
        />

        {/* 🔐 PASSWORD */}
        <label className="text-sm text-gray-300 mb-1">Password*</label>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={() => setShowPassword(false)}
            placeholder="Enter your password"
            className="w-full h-9 rounded border bg-gray-200 px-2 text-black pr-16"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              text-xs font-semibold text-blue-600
              transition-all duration-200
              hover:text-blue-800 hover:scale-105
            "
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* 🔢 CAPTCHA (BOTTOM + HORIZONTAL + REFRESH) */}
        <label className="flex justify-between items-center text-sm text-gray-300 mb-1">
          <span>Captcha*</span>
          <button
            type="button"
            onClick={generateCaptcha}
            className="text-xs text-blue-400 hover:text-blue-600 transition"
          >
            Refresh
          </button>
        </label>

        <div className="flex items-center gap-2 mb-3">
          <div className="bg-gray-300 text-black px-4 py-2 rounded font-bold">
            {captcha.a} + {captcha.b} = ?
          </div>
          <input
            name="captchaAnswer"
            value={form.captchaAnswer}
            onChange={handleChange}
            placeholder="Answer"
            className="flex-1 h-9 rounded border bg-gray-200 px-2 text-black"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full h-10 bg-blue-600 text-white font-bold rounded active:scale-95"
        >
          Log in
        </button>
      </div>

      <div className="mt-2 text-white text-sm">
        Don’t have an account?
        <Link href="/register" className="ml-1 text-yellow-400 underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
