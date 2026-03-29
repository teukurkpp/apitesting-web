"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sideBar";
import DashboardPage from "@/app/dashboard/page";
import ApisPage from "@/app/apis/page";
import LogsPage from "@/app/logs/page";
import { apiFetch } from "@/lib/api";
import { ApiTarget } from "@/lib/types";

type Page = "dashboard" | "apis" | "logs";

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Dashboard",
  apis: "Kelola API",
  logs: "Log Monitor",
};

export default function AppShell() {
  const [page, setPage] = useState<Page>("dashboard");
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    const fetchActiveCount = async () => {
      try {
        const apis = await apiFetch<ApiTarget[]>("/apis");
        setActiveCount(apis.filter((a) => a.status === "active").length);
      } catch (err) {
        console.error("Gagal memuat jumlah API aktif", err);
      }
    };

    fetchActiveCount();
    const interval = setInterval(fetchActiveCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#020617",
        color: "#f1f5f9",
        fontFamily: "'Syne', sans-serif",
        overflow: "hidden",
      }}
    >
      <Sidebar page={page} setPage={setPage} />

      <main style={{ flex: 1, overflowY: "auto", padding: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                color: "#f1f5f9",
              }}
            >
              {PAGE_TITLES[page]}
            </h1>
            <div
              style={{
                fontSize: 13,
                color: "#475569",
                marginTop: 4,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <span
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              color: "#64748b",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {activeCount} API Aktif
          </span>
        </div>

        {page === "dashboard" && <DashboardPage />}
        {page === "apis" && <ApisPage />}
        {page === "logs" && <LogsPage />}
      </main>
    </div>
  );
}
