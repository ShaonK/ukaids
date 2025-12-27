"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import registerAction from "./action";

/* --------------------
   COUNTRY LIST
-------------------- */
const COUNTRIES = [
  { name: "🇬🇧 United Kingdom", code: "+44", flag: "/flags/gb.svg" },
  { name: "🇧🇩 Bangladesh", code: "+880", flag: "/flags/bd.svg" },
  { name: "🇮🇳 India", code: "+91", flag: "/flags/in.svg" },
  { name: "🇵🇰 Pakistan", code: "+92", flag: "/flags/pk.svg" },
  { name: "🇺🇸 United States", code: "+1", flag: "/flags/us.svg" },
  { name: "🇦🇪 United Arab Emirates", code: "+971", flag: "/flags/ae.svg" },
  { name: "🇸🇦 Saudi Arabia", code: "+966", flag: "/flags/sa.svg" },
  { name: "🇲🇾 Malaysia", code: "+60", flag: "/flags/my.svg" },
  { name: "🇸🇬 Singapore", code: "+65", flag: "/flags/sg.svg" },
];

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get("ref");

  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });

  useEffect(() => {
    setCaptcha({
      a: Math.floor(Math.random() * 9) + 1,
      b: Math.floor(Math.random() * 9) + 1,
    });
  }, []);

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    referral: "",
    country: COUNTRIES[0],
    mobile: "",
    email: "",
    password: "",
    cpassword: "",
    tpassword: "",
    captchaAnswer: "",
    agree: false,
  });

  const [showPass, setShowPass] = useState(false);
  const [showTPass, setShowTPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (refFromUrl) {
      setForm((prev) => ({ ...prev, referral: refFromUrl }));
    }
  }, [refFromUrl]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCountryChange(e) {
    const selected = COUNTRIES.find(
      (c) => c.code === e.target.value
    );
    setForm((prev) => ({
      ...prev,
      country: selected,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!form.agree) {
      setMessage("Please accept the terms & conditions");
      return;
    }

    if (Number(form.captchaAnswer) !== captcha.a + captcha.b) {
      setMessage("Captcha answer is incorrect");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      countryCode: form.country.code,
      mobile: `${form.country.code}${form.mobile}`,
    };

    const res = await registerAction(payload);

    if (!res.success) {
      setMessage(res.message);
      setLoading(false);
      return;
    }

    alert("Registration successful. Please login.");
    router.push("/login");
  }

  /* STYLE TUNING */
  const inputClass =
    "w-full px-3 py-2 rounded-md bg-white text-sm text-black focus:outline-none focus:ring-1 focus:ring-orange-500";
  const labelClass =
    "text-sm text-gray-200 mb-0.5 font-semibold";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f2027] to-[#2c5364] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] bg-[#111] border border-gray-700 p-5 rounded-xl space-y-2 shadow-xl"
      >
        <h1 className="text-xl font-bold text-center text-white mb-2">
          Create Account
        </h1>

        <div>
          <label className={labelClass}>Full Name</label>
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Referral Code (optional)</label>
          <input
            name="referral"
            value={form.referral}
            onChange={handleChange}
            readOnly={!!refFromUrl}
            className={`${inputClass} ${
              refFromUrl ? "bg-gray-300 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Country */}
        <div>
          <label className={labelClass}>Select Country</label>
          <div className="relative">
            <select
              value={form.country.code}
              onChange={handleCountryChange}
              className="w-full appearance-none px-3 py-2 pl-11 rounded-md bg-white text-sm text-black cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>

            <img
              src={form.country.flag}
              alt="flag"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-4 rounded-sm pointer-events-none"
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className={labelClass}>Mobile Number</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700">
              {form.country.code}
            </span>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Phone number"
              className="w-full pl-14 pr-3 py-2 rounded-md bg-white text-sm text-black focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email (optional)</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-2 cursor-pointer text-xs text-gray-600"
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass}>Confirm Password</label>
          <input
            type="password"
            name="cpassword"
            value={form.cpassword}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Transaction Password</label>
          <div className="relative">
            <input
              type={showTPass ? "text" : "password"}
              name="tpassword"
              value={form.tpassword}
              onChange={handleChange}
              className={inputClass}
            />
            <span
              onClick={() => setShowTPass(!showTPass)}
              className="absolute right-3 top-2 cursor-pointer text-xs text-gray-600"
            >
              {showTPass ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass}>Captcha</label>
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 text-black px-3 py-1 rounded text-sm font-semibold">
              {captcha.a} + {captcha.b} = ?
            </div>
            <input
              name="captchaAnswer"
              value={form.captchaAnswer}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="accent-orange-500"
          />
          <span>I agree to the Terms & Conditions</span>
        </div>

        {message && (
          <p className="text-red-500 text-xs text-center font-medium">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#EC7B03] hover:bg-[#d96f02] transition py-2 rounded-md font-bold text-sm text-black disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-xs text-gray-400 pt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#EC7B03] hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
