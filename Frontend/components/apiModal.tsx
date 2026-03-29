"use client";

import { useState } from "react";
import { ApiTarget, HttpMethod } from "@/lib/types";
import { methodColor } from "@/lib/utils";

interface ApiModalProps {
  api?: ApiTarget;
  onClose: () => void;
  onSave?: (data: Omit<ApiTarget, "id" | "avgResponseTime" | "uptime">) => void;
}

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE"];

export default function ApiModal({ api, onClose, onSave }: ApiModalProps) {
  const isEdit = !!api;
  const [form, setForm] = useState({
    name: api?.name ?? "",
    url: api?.url ?? "",
    method: api?.method ?? ("GET" as HttpMethod),
    interval: api?.interval ?? 30,
    status: api?.status ?? ("active" as const),
  });

  function handleSave() {
    onSave?.(form);
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#00000088",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 16,
          padding: 32,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 25px 50px #00000088",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#f1f5f9",
            fontFamily: "'Syne', sans-serif",
            marginBottom: 24,
          }}
        >
          {isEdit ? "Edit API" : "Tambah API Baru"}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Nama API</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="misal: User Service"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Endpoint URL</label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://api.example.com/users"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Method</label>
            <select
              value={form.method}
              onChange={(e) =>
                setForm((p) => ({ ...p, method: e.target.value as HttpMethod }))
              }
              style={{
                ...inputStyle,
                color: methodColor(form.method),
                cursor: "pointer",
              }}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Interval (detik)</label>
            <input
              type="number"
              value={form.interval}
              onChange={(e) =>
                setForm((p) => ({ ...p, interval: Number(e.target.value) }))
              }
              min={10}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              background: "transparent",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#64748b",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              padding: "11px",
              background: "#38bdf8",
              border: "none",
              borderRadius: 8,
              color: "#0c1a29",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {isEdit ? "Simpan Perubahan" : "Tambah API"}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#64748b",
  fontFamily: "'DM Mono', monospace",
  marginBottom: 6,
  letterSpacing: 1,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#f1f5f9",
  fontSize: 14,
  fontFamily: "'DM Mono', monospace",
  outline: "none",
};
