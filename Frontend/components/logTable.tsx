import { ApiLog } from "@/lib/types";
import { statusBadge, responseTimeColor } from "@/lib/utils";

interface LogTableProps {
  logs: ApiLog[];
  compact?: boolean;
}

export default function LogTable({ logs, compact = false }: LogTableProps) {
  const headers = ["Waktu", "API", "Status", "Response Time"];
  if (!compact) headers.push("Size");

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  color: "#475569",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  letterSpacing: 1,
                  fontWeight: 500,
                  borderBottom: "1px solid #1e293b",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const badge = statusBadge(log.statusCode);
            const rtColor = responseTimeColor(log.responseTime);
            return (
              <tr key={log.id} style={{ borderBottom: "1px solid #0f172a" }}>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "#64748b",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                  }}
                >
                  {log.createdAt}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "#cbd5e1",
                    fontWeight: 500,
                  }}
                >
                  {log.apiName}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      background: badge.bg + "22",
                      color: badge.textColor,
                      border: `1px solid ${badge.bg}`,
                      borderRadius: 5,
                      padding: "2px 8px",
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {badge.label}
                  </span>
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    color: rtColor,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {log.responseTime} ms
                </td>
                {!compact && (
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "#64748b",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {log.responseSize}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
