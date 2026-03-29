"use client";

type Page = "dashboard" | "apis" | "logs";

interface SidebarProps {
  page: Page;
  setPage: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "apis", label: "Kelola API", icon: "◈" },
  { id: "logs", label: "Log Monitor", icon: "≡" },
];

export default function Sidebar({ page, setPage }: SidebarProps) {
  return (
    <aside
      style={{
        width: 220,
        background: "#020617",
        borderRight: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{ padding: "28px 24px 20px", borderBottom: "1px solid #1e293b" }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#475569",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          SISTEM MONITORING
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            fontFamily: "'Syne', sans-serif",
            color: "#f1f5f9",
            lineHeight: 1.1,
          }}
        >
          API
          <br />
          <span style={{ color: "#38bdf8" }}>Monitor</span>
        </div>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "10px 14px",
              borderRadius: 9,
              border: "none",
              background: page === id ? "#0f172a" : "transparent",
              color: page === id ? "#38bdf8" : "#475569",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Syne', sans-serif",
              fontWeight: page === id ? 600 : 400,
              marginBottom: 4,
              textAlign: "left",
              borderLeft:
                page === id ? "2px solid #38bdf8" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "16px 24px", borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px #10b981",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "#475569",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Engine aktif
          </span>
        </div>
      </div>
    </aside>
  );
}
