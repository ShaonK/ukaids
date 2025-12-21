"use client";

import { useEffect, useState } from "react";

export default function AdminPackagesClient() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // -----------------------
  // LOAD PACKAGES
  // -----------------------
  async function loadPackages() {
    try {
      const res = await fetch("/api/admin/packages", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load packages");
      }

      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load packages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPackages();
  }, []);

  // -----------------------
  // ACTIVATE PACKAGE
  // -----------------------
  async function activate(packageId) {
    if (processingId) return;

    setProcessingId(packageId);

    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Activation failed");
      }

      // reload list
      await loadPackages();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  }

  // -----------------------
  // UI
  // -----------------------
  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Loading packages...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Packages Control</h1>

      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="flex items-center justify-between border rounded-lg p-4 bg-white"
        >
          {/* LEFT */}
          <div>
            <h3 className="font-semibold">{pkg.name}</h3>
            <p className="text-sm text-gray-500">
              Amount: ${pkg.amount}
            </p>
          </div>

          {/* RIGHT */}
          <div>
            {pkg.isActive ? (
              <span className="px-3 py-1 bg-green-600 text-white text-xs rounded">
                Already Active
              </span>
            ) : (
              <button
                onClick={() => activate(pkg.id)}
                disabled={processingId === pkg.id}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded disabled:opacity-50"
              >
                {processingId === pkg.id
                  ? "Activating..."
                  : "Activate Now"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
