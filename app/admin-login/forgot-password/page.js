"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminForgotPassword() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/admin/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (data.error) {
      setMsg(data.error);
    } else {
      setToken(data.token);
      setMsg("Reset link generated successfully");
    }
  }

  function goToReset() {
    router.push(`/admin-login/reset-password?token=${token}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm bg-white text-black rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-center mb-4">
          Admin Password Reset
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin username"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded font-medium hover:bg-gray-900 transition"
          >
            Generate reset link
          </button>
        </form>

        {msg && (
          <p className="mt-3 text-sm text-center text-gray-700">
            {msg}
          </p>
        )}

        {token && (
          <button
            onClick={goToReset}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Reset Password Now
          </button>
        )}
      </div>
    </div>
  );
}
