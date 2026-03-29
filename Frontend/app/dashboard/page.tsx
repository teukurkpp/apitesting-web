"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import StatCard from "@/components/statCard";
import SectionTitle from "@/components/sectionTitle";
import LogTable from "@/components/logTable";
import {
  ApiLog,
  ResponseTimePoint,
  StatusDistItem,
  DashboardSummary,
} from "@/lib/types";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({
    avgResponseTime: 0,
    totalRequests: 0,
    errorRate: "0%",
    uptime: 0,
  });
  const [responseData, setResponseData] = useState<ResponseTimePoint[]>([]);
  const [statusData, setStatusData] = useState<StatusDistItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    try {
      setError(null);
      const [sum, rt, sd, logs] = await Promise.all([
        apiFetch<DashboardSummary>("/dashboard/summary"),
        apiFetch<ResponseTimePoint[]>("/dashboard/response-time"),
        apiFetch<StatusDistItem[]>("/dashboard/status-dist"),
        apiFetch<ApiLog[]>("/logs?filter=all&range=today"),
      ]);

      setSummary(sum);
      setResponseData(rt);
      setStatusData(sd);
      setRecentLogs(logs.slice(0, 5));
    } catch (err: any) {
      console.error("Gagal memuat dashboard:", err);
      setError(
        "Gagal memuat data. Pastikan backend berjalan dan database terhubung.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div style={{ color: "#64748b", padding: "60px" }}>
        Memuat Dashboard...
      </div>
    );

  if (error)
    return <div style={{ color: "#ef4444", padding: "60px" }}>{error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <SectionTitle>Ringkasan</SectionTitle>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <StatCard
            label="Avg Response Time"
            value={`${summary.avgResponseTime} ms`}
            sub="semua API aktif"
            accent="#38bdf8"
          />
          <StatCard
            label="Total Request"
            value={summary.totalRequests.toLocaleString()}
            sub="keseluruhan"
            accent="#8b5cf6"
          />
          <StatCard
            label="Error Rate"
            value={summary.errorRate}
            sub="keseluruhan"
            accent="#f59e0b"
          />
          <StatCard
            label="Uptime"
            value={`${summary.uptime}%`}
            sub="rata-rata semua API"
            accent="#10b981"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <SectionTitle>Response Time (ms)</SectionTitle>
          {responseData.length === 0 ? (
            <div
              style={{ color: "#64748b", textAlign: "center", padding: "20px" }}
            >
              Belum ada data response time. Tambahkan dan aktifkan API untuk
              memulai monitoring.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={responseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="time"
                  stroke="#475569"
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                    fontFamily: "DM Mono",
                  }}
                />
                <YAxis
                  stroke="#475569"
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                    fontFamily: "DM Mono",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />

                {(() => {
                  const keys = Object.keys(responseData[0]).filter(
                    (k) => k !== "time",
                  );
                  const colors = [
                    "#38bdf8",
                    "#8b5cf6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#a78bfa",
                    "#f43f5e",
                  ];
                  return keys.map((key, i) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colors[i % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      name={key}
                    />
                  ));
                })()}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <SectionTitle>Status Code</SectionTitle>
          {statusData.length === 0 ? (
            <div
              style={{ color: "#64748b", textAlign: "center", padding: "20px" }}
            >
              Belum ada distribusi status code. Tunggu beberapa ping selesai.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: 8,
            }}
          >
            {statusData.map((d) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: "#94a3b8",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: d.color,
                  }}
                />
                <span style={{ flex: 1 }}>{d.name}</span>
                <span
                  style={{
                    color: "#f1f5f9",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <SectionTitle>Log Terbaru</SectionTitle>
        {recentLogs.length === 0 ? (
          <div
            style={{ color: "#64748b", textAlign: "center", padding: "20px" }}
          >
            Belum ada log terbaru. Sistem akan mulai mencatat setelah ping
            pertama.
          </div>
        ) : (
          <LogTable logs={recentLogs} compact />
        )}
      </div>
    </div>
  );
}
