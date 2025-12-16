"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import registerAction from "./action";

export default function RegisterClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refFromUrl = searchParams.get("ref");

    /* --------------------
       CAPTCHA
    -------------------- */
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
        countryCode: "+880",
        mobile: "",
        email: "",
        password: "",
        cpassword: "",
        tpassword: "",
        captchaAnswer: "",
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
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        if (Number(form.captchaAnswer) !== captcha.a + captcha.b) {
            setMessage("Captcha answer is incorrect");
            return;
        }

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
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0f2027] to-[#2c5364] flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-[380px] bg-[#111] border border-gray-700 p-6 rounded-2xl space-y-4 shadow-xl"
            >
                <h1 className="text-2xl font-bold text-center text-white">
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

                {/* Referral */}
                <input
                    name="referral"
                    value={form.referral}
                    onChange={handleChange}
                    readOnly={!!refFromUrl}
                    placeholder="Referred By (optional)"
                    className={`w-full p-3 rounded-lg ${refFromUrl
                            ? "bg-gray-300 text-black cursor-not-allowed"
                            : "bg-white text-black"
                        }`}
                />


                {/* Country + Mobile */}
                <div className="flex gap-2">
                    <select
                        name="countryCode"
                        value={form.countryCode}
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-white text-black"
                    >
                        <option value="+880">🇧🇩 +880</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+92">🇵🇰 +92</option>
                    </select>

                    <input
                        name="mobile"
                        value={form.mobile}
                        placeholder="Mobile Number"
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <input
                    name="email"
                    value={form.email}
                    placeholder="Email (optional)"
                    onChange={handleChange}
                    className={inputClass}
                />

                {/* Password */}
                <div className="relative">
                    <input
                        type={showPass ? "text" : "password"}
                        name="password"
                        value={form.password}
                        placeholder="Password"
                        onChange={handleChange}
                        className={inputClass}
                    />
                    <span
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-3 cursor-pointer text-sm text-gray-600"
                    >
                        {showPass ? "Hide" : "Show"}
                    </span>
                </div>

                <input
                    type="password"
                    name="cpassword"
                    value={form.cpassword}
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    className={inputClass}
                />

                {/* Transaction Password */}
                <div className="relative">
                    <input
                        type={showTPass ? "text" : "password"}
                        name="tpassword"
                        value={form.tpassword}
                        placeholder="Transaction Password"
                        onChange={handleChange}
                        className={inputClass}
                    />
                    <span
                        onClick={() => setShowTPass(!showTPass)}
                        className="absolute right-3 top-3 cursor-pointer text-sm text-gray-600"
                    >
                        {showTPass ? "Hide" : "Show"}
                    </span>
                </div>

                {/* Captcha */}
                <div className="flex items-center gap-3">
                    <div className="bg-gray-200 text-black px-4 py-2 rounded font-semibold">
                        {captcha.a} + {captcha.b} = ?
                    </div>
                    <input
                        name="captchaAnswer"
                        value={form.captchaAnswer}
                        placeholder="Answer"
                        onChange={handleChange}
                        className="flex-1 p-3 rounded-lg bg-white text-black"
                    />
                </div>

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
