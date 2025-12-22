"use client";

import { useState } from "react";

export default function ProfileForm({ user }) {
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    country: user.country || "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/user/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) setMsg(data.error);
    else setMsg("Profile updated successfully");
  };

  return (
    <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
      <input
        value={user.email}
        disabled
        className="w-full p-2 bg-[#1a1a1a] rounded text-sm text-gray-400"
      />

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-2 bg-[#1a1a1a] rounded text-sm"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full p-2 bg-[#1a1a1a] rounded text-sm"
      />

      <input
        name="country"
        value={form.country}
        onChange={handleChange}
        placeholder="Country"
        className="w-full p-2 bg-[#1a1a1a] rounded text-sm"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full py-2 bg-[#EC7B03] rounded font-semibold"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {msg && (
        <p className="text-xs text-center text-green-400">
          {msg}
        </p>
      )}
    </div>
  );
}
