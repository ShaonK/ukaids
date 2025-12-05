"use client";

import { useState } from "react";
import registerAction from "./action";

export default function RegisterPage() {
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

    const [msg, setMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await registerAction(form);
        setMsg(res.message);

        if (res.success) {
            window.location.href = "/login";
        }
    }

    return (
        <div className="p-5 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-center mb-4">Register</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                {/* All inputs */}
                {Object.keys(form).map((key) =>
                    key !== "captcha" ? (
                        <input
                            key={key}
                            placeholder={key.toUpperCase()}
                            className="border p-3 rounded"
                            type={key.includes("password") ? "password" : "text"}
                            onChange={(e) =>
                                setForm({ ...form, [key]: e.target.value })
                            }
                        />
                    ) : null
                )}

                {/* Captcha Box */}
                <div className="flex justify-between items-center border p-3 rounded bg-gray-100">
                    <span className="font-bold text-lg">1234</span>
                    <input
                        placeholder="Enter Captcha"
                        className="border p-2 rounded w-32"
                        onChange={(e) =>
                            setForm({ ...form, captcha: e.target.value })
                        }
                    />
                </div>

                <button className="bg-green-600 text-white p-3 rounded active:scale-95 transition">
                    Register
                </button>

                {msg && <p className="text-center text-red-500">{msg}</p>}
            </form>
        </div>
    );
}
