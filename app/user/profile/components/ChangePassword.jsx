"use client";

import { useState } from "react";

export default function ChangePassword() {
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
    });

    const submit = async () => {
        await fetch("/api/user/profile/password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        alert("Password updated");
    };

    return (
        <div className="mt-6 bg-[#111] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
            <h3 className="text-yellow-400 font-semibold">
                Change Password
            </h3>

            <input
                type="password"
                placeholder="Old Password"
                className="w-full p-2 bg-[#1a1a1a] rounded"
                onChange={(e) =>
                    setForm({ ...form, oldPassword: e.target.value })
                }
            />

            <input
                type="password"
                placeholder="New Password"
                className="w-full p-2 bg-[#1a1a1a] rounded"
                onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                }
            />

            <button
                onClick={submit}
                className="w-full py-2 bg-[#3B82F6] rounded font-semibold"
            >
                Update Password
            </button>
        </div>
    );
}
