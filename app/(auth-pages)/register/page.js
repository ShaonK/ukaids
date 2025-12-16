"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import registerAction from "./action";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const refFromUrl = searchParams.get("ref");

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
    setForm({ ...form, [e.target.name]: e.target.value });
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

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] bg-[#111] p-5 rounded-xl space-y-3"
      >
        <h1 className="text-xl font-bold text-center mb-2">
          Create Account
        </h1>

        <input
          name="fullname"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 rounded text-black"
        />

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-3 rounded text-black"
        />

        {/* 🔥 REFERRAL */}
        <input
          name="referral"
          value={form.referral}
          onChange={handleChange}
          disabled={!!refFromUrl}
          placeholder="Referred By *"
          className={`w-full p-3 rounded ${
            refFromUrl ? "bg-gray-300 text-black" : "text-black"
          }`}
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="w-full p-3 rounded text-black"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 rounded text-black"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 rounded text-black"
        />

        <input
          type="password"
          name="cpassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full p-3 rounded text-black"
        />

        <input
          type="password"
          name="tpassword"
          placeholder="Transaction Password"
          onChange={handleChange}
          className="w-full p-3 rounded text-black"
        />

        <input
          name="captcha"
          placeholder="Enter Captcha"
          onChange={handleChange}
          className="w-full p-3 rounded text-black"
        />

        {message && (
          <p className="text-red-400 text-sm text-center">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#EC7B03] py-3 rounded font-semibold text-black"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
