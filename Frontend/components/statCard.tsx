interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent: string;
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        minWidth: 160,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#64748b",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#f1f5f9",
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
