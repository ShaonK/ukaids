"use client";

import { useEffect, useState } from "react";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [editId, setEditId] = useState(null);

  async function loadNotices() {
    const res = await fetch("/api/admin/notices", { cache: "no-store" });
    const data = await res.json();
    setNotices(data);
  }

  useEffect(() => {
    loadNotices();
  }, []);

  async function submitNotice(e) {
    e.preventDefault();

    const payload = { title, message, isActive };

    if (editId) {
      await fetch(`/api/admin/notices/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    loadNotices();
  }

  function resetForm() {
    setTitle("");
    setMessage("");
    setIsActive(false);
    setEditId(null);
  }

  async function activateNotice(id) {
    await fetch(`/api/admin/notices/${id}/activate`, {
      method: "PATCH",
    });
    loadNotices();
  }

  async function deleteNotice(id) {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    await fetch(`/api/admin/notices/${id}`, {
      method: "DELETE",
    });

    loadNotices();
  }

  function startEdit(n) {
    setEditId(n.id);
    setTitle(n.title);
    setMessage(n.message);
    setIsActive(n.isActive);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold mb-4">Notice Management</h1>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={submitNotice}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notice title"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Notice message"
          className="w-full border px-3 py-2 rounded h-24"
          required
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Set as active
        </label>

        <div className="flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded">
            {editId ? "Update Notice" : "Add Notice"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* NOTICE LIST */}
      <div className="space-y-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className="border p-3 rounded flex justify-between items-start"
          >
            <div>
              <h3 className="font-medium">
                {n.title}{" "}
                {n.isActive && (
                  <span className="text-green-600 text-sm">(Active)</span>
                )}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              {!n.isActive && (
                <button
                  onClick={() => activateNotice(n.id)}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                >
                  Activate
                </button>
              )}

              <button
                onClick={() => startEdit(n)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteNotice(n.id)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
