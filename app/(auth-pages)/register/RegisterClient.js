"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import registerAction from "./action";

export default function RegisterClient() {
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

    useEffect(() => {
        if (refFromUrl) {
            setForm((prev) => ({ ...prev, referral: refFromUrl }));
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

    const inputClass =
        "w-full p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500";

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-[380px] bg-[#111] border border-gray-700 p-6 rounded-2xl space-y-4 shadow-xl"
            >
                <h1 className="text-2xl font-bold text-center text-white">
                    Create Account
                </h1>

                <input name="fullname" placeholder="Full Name" onChange={handleChange} className={inputClass} />
                <input name="username" placeholder="Username" onChange={handleChange} className={inputClass} />

                <input
                    name="referral"
                    value={form.referral}
                    onChange={handleChange}
                    placeholder="Referred By"
                    className={inputClass}
                    disabled={!!refFromUrl}
                />

                <input name="mobile" placeholder="Mobile Number" onChange={handleChange} className={inputClass} />
                <input name="email" placeholder="Email" onChange={handleChange} className={inputClass} />

                <input type="password" name="password" placeholder="Password" onChange={handleChange} className={inputClass} />
                <input type="password" name="cpassword" placeholder="Confirm Password" onChange={handleChange} className={inputClass} />
                <input type="password" name="tpassword" placeholder="Transaction Password" onChange={handleChange} className={inputClass} />

                {message && <p className="text-red-500 text-sm text-center">{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#EC7B03] py-3 rounded font-semibold text-black"
                >
                    {loading ? "Creating..." : "Register"}
                </button>
            </form>
        </div>
    );
}
