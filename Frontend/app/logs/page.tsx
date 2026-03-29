"use client";

import { useState, useEffect } from "react";
import { ApiLog } from "@/lib/types";
import SectionTitle from "@/components/sectionTitle";
import LogTable from "@/components/logTable";
import { apiFetch } from "@/lib/api";

type FilterType = "all" | "success" | "error";
type RangeType = "today" | "7d" | "30d";

const FILTER_LABELS = [
  { value: "all" as const, label: "Semua" },
  { value: "success" as const, label: "Sukses" },
  { value: "error" as const, label: "Error" },
];

const RANGE_LABELS = [
  { value: "today" as const, label: "Hari Ini" },
  { value: "7d" as const, label: "7 Hari" },
  { value: "30d" as const, label: "30 Hari" },
];

export default function LogsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [range, setRange] = useState<RangeType>("today");
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const data = await apiFetch<ApiLog[]>(
        `/logs?filter=${filter}&range=${range}`,
      );
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [filter, range]);

  if (loading)
    return (
      <div style={{ color: "#64748b", padding: "40px" }}>Loading logs...</div>
    );

  return (
    <div>
      <SectionTitle>Log Monitoring</SectionTitle>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        <div
          style={{
            display: "flex",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {FILTER_LABELS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              style={{
                background: filter === value ? "#38bdf8" : "transparent",
                color: filter === value ? "#0c1a29" : "#64748b",
                border: "none",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "'DM Mono', monospace",
                fontWeight: filter === value ? 700 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {RANGE_LABELS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              style={{
                background: range === value ? "#1e293b" : "transparent",
                color: range === value ? "#e2e8f0" : "#64748b",
                border: "none",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <LogTable logs={logs} />
      </div>
    </div>
  );
}
