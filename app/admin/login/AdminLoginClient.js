"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import adminLoginAction from "./action";

export default function AdminLoginClient() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  async function handleLogin() {
    setMessage("");

    const fd = new FormData();
    fd.append("username", form.username);
    fd.append("password", form.password);

    const res = await adminLoginAction(fd);

    if (res?.error) {
      setMessage(res.error);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="p-6 max-w-[420px] mx-auto">
      <h1 className="text-xl font-bold text-center">
        Admin Login
      </h1>

      <div className="flex flex-col gap-3 mt-6">
        <input
          placeholder="Username"
          className="border p-3 rounded"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-3 rounded"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {message && (
          <p className="text-red-500 text-sm text-center">
            {message}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white p-3 rounded active:scale-95"
        >
          Login
        </button>
      </div>
    </div>
  );
}
