export const dynamic = "force-dynamic";

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AdminResetPassword() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/admin/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (data.error) {
      setMsg(data.error);
      return;
    }

    setSuccess(true);
    setMsg("Password reset successful. Redirecting to admin login...");

    // ⏳ redirect after 2 seconds
    setTimeout(() => {
      router.push("/admin/login");
    }, 2000);
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <p className="text-red-500 text-center">
          Invalid or missing reset token
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm bg-white text-black rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-center mb-4">
          Set New Password
        </h2>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            disabled={success}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={success}
            className="w-full bg-black text-white py-2 rounded font-medium
                       hover:bg-gray-900 transition
                       disabled:opacity-60"
          >
            Reset Password
          </button>
        </form>

        {msg && (
          <p
            className={`mt-4 text-sm text-center ${
              success ? "text-green-600" : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
