"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import registerAction from "./action";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get("ref");
  useEffect(() => {
    document.querySelectorAll("input").forEach((i) => {
      if (i.value && !i.onchange) {
        console.log("⚠️ Missing onChange:", i.name);
      }
    });
  }, []);


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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ---------------------------
     AUTO FILL REFERRAL
  ---------------------------- */
  useEffect(() => {
    if (refFromUrl) {
      setForm((prev) => ({
        ...prev,
        referral: refFromUrl,
      }));
    }
  }, [refFromUrl]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const res = await registerAction(form);

    if (!res.success) {
      setMessage(res.message);
      setLoading(false);
      return;
    }

    alert("Registration successful. Please login.");
    router.push("/login");
  }

  const inputClass =
    "w-full p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] bg-[#111] border border-gray-700 p-6 rounded-2xl space-y-4 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Create Account
        </h1>

        <input
          name="fullname"
          value={form.fullname}
          placeholder="Full Name"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="username"
          value={form.username}
          placeholder="Username"
          onChange={handleChange}
          className={inputClass}
        />

        {/* REFERRAL  */}
        <input
          name="referral"
          value={form.referral}
          disabled={!!refFromUrl}
          placeholder="Referred By (optional)"
          className={`w-full p-3 rounded-lg ${refFromUrl ? "bg-gray-300" : "bg-white"
            } text-black`}
        />




        <input
          name="mobile"
          value={form.mobile}
          placeholder="Mobile Number"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="email"
          value={form.email}
          placeholder="Email (optional)"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          type="password"
          name="cpassword"
          value={form.cpassword}
          placeholder="Confirm Password"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          type="password"
          name="tpassword"
          value={form.tpassword}
          placeholder="Transaction Password"
          onChange={handleChange}
          className={inputClass}
        />

        <input
          name="captcha"
          value={form.captcha}
          placeholder="Enter Captcha"
          onChange={handleChange}
          className={inputClass}
        />

        {message && (
          <p className="text-red-500 text-sm text-center font-medium">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#EC7B03] hover:bg-[#d96f02] transition py-3 rounded-lg font-bold text-black disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
