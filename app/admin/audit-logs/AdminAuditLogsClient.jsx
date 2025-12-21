"use client";

import { useEffect, useState } from "react";

export default function AdminAuditLogsClient() {
  const [logs, setLogs] = useState([]);

  async function loadLogs() {
    const res = await fetch("/api/admin/audit-logs", { cache: "no-store" });
    const data = await res.json();
    setLogs(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Audit Logs</h1>

      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="bg-white p-3 rounded shadow text-sm">
            <p>
              <b>Action:</b> {log.action}
            </p>
            <p>
              <b>Target:</b> {log.targetType} #{log.targetId}
            </p>
            <p className="text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
