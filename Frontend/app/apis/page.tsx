"use client";

import { useState, useEffect } from "react";
import { ApiTarget } from "@/lib/types";
import { methodColor, responseTimeColor } from "@/lib/utils";
import SectionTitle from "@/components/sectionTitle";
import ApiModal from "@/components/apiModal";
import { apiFetch } from "@/lib/api";

export default function ApisPage() {
  const [apis, setApis] = useState<ApiTarget[]>([]);
  const [modal, setModal] = useState<{ api?: ApiTarget } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadApis = async () => {
    try {
      const data = await apiFetch<ApiTarget[]>("/apis");
      setApis(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApis();
  }, []);

  const handleSave = async (
    data: Omit<ApiTarget, "id" | "avgResponseTime" | "uptime">,
  ) => {
    try {
      if (modal?.api) {
        await apiFetch(`/apis/${modal.api.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } else {
        await apiFetch("/apis", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
      loadApis();
      setModal(null);
    } catch (err) {
      alert("Gagal menyimpan API");
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      await apiFetch(`/apis/${id}/toggle`, { method: "PATCH" });
      loadApis();
    } catch (err) {
      alert("Gagal toggle status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus API ini permanently?")) return;
    try {
      await apiFetch(`/apis/${id}`, { method: "DELETE" });
      loadApis();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  if (loading) {
    return (
      <div style={{ color: "#64748b", padding: "40px" }}>Loading APIs...</div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <SectionTitle>Daftar API Target</SectionTitle>
        <button
          onClick={() => setModal({})}
          style={{
            background: "#38bdf8",
            color: "#0c1a29",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          + Tambah API
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {apis.map((api) => (
          <div
            key={api.id}
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span
              style={{
                background: methodColor(api.method) + "22",
                color: methodColor(api.method),
                border: `1px solid ${methodColor(api.method)}44`,
                borderRadius: 6,
                padding: "3px 10px",
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 700,
                minWidth: 48,
                textAlign: "center",
              }}
            >
              {api.method}
            </span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "#f1f5f9",
                  fontWeight: 600,
                  fontSize: 15,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {api.name}
              </div>
              <div
                style={{
                  color: "#475569",
                  fontSize: 12,
                  fontFamily: "'DM Mono', monospace",
                  marginTop: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {api.url}
              </div>
            </div>

            <div style={{ textAlign: "center", minWidth: 70 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>
                Interval
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {api.interval}s
              </div>
            </div>

            <div style={{ textAlign: "center", minWidth: 80 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>
                Avg RT
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "'DM Mono', monospace",
                  color: responseTimeColor(api.avgResponseTime),
                }}
              >
                {api.avgResponseTime} ms
              </div>
            </div>

            <div style={{ textAlign: "center", minWidth: 70 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>
                Uptime
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#10b981",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {api.uptime}%
              </div>
            </div>

            <div
              onClick={() => toggleStatus(api.id)}
              style={{
                width: 42,
                height: 24,
                borderRadius: 12,
                background: api.status === "active" ? "#10b981" : "#334155",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  top: 3,
                  left: api.status === "active" ? 21 : 3,
                  transition: "left 0.2s",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setModal({ api })}
                style={actionBtnStyle("#1e293b", "#94a3b8")}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(api.id)}
                style={actionBtnStyle("#1e293b", "#ef4444")}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <ApiModal
          api={modal.api}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function actionBtnStyle(bg: string, color: string): React.CSSProperties {
  return {
    background: bg,
    color,
    border: `1px solid ${color}33`,
    borderRadius: 7,
    padding: "6px 14px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
  };
}
