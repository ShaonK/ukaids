"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage("Password reset successful");
      setTimeout(() => {
        router.push("/admin/login");
      }, 1500);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm bg-white text-black rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-center mb-4">
          Reset Admin Password
        </h2>

        {!token ? (
          <p className="text-sm text-red-600 text-center">
            Invalid or missing reset token
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
            >
              Reset Password
            </button>
          </form>
        )}

        {message && (
          <p className="mt-3 text-sm text-center text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
