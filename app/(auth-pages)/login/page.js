"use client";

import { useState } from "react";
import loginAction from "./action";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [user, setUser] = useState({
        username: "",
        password: "",
        captcha: "",
    });

    const [message, setMessage] = useState("");

    async function handleLogin() {
        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("password", user.password);
        formData.append("captcha", user.captcha);

        const res = await loginAction(formData);

        if (res.error) {
            setMessage(res.error);
        } else {
            router.push("/user/home");
        }
    }

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold text-center">Login</h1>

            <div className="mt-6 flex flex-col gap-3">
                <input
                    placeholder="Username"
                    className="border p-3 rounded"
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="border p-3 rounded"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />

                <input
                    placeholder="Captcha (Type: 1234)"
                    className="border p-3 rounded"
                    onChange={(e) => setUser({ ...user, captcha: e.target.value })}
                />

                {message && (
                    <p className="text-red-500 text-sm">{message}</p>
                )}

                <button
                    className="bg-blue-600 text-white p-3 rounded active:scale-95 transition"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}
