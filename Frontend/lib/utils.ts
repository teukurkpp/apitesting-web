export function statusBadge(code: number) {
  if (code >= 200 && code < 300)
    return { bg: "#d1fae5", textColor: "#34d399", label: code };
  if (code >= 400 && code < 500)
    return { bg: "#fef3c7", textColor: "#fbbf24", label: code };
  return { bg: "#fee2e2", textColor: "#f87171", label: code };
}

export function responseTimeColor(ms: number): string {
  if (ms <= 200) return "#10b981";
  if (ms <= 800) return "#f59e0b";
  return "#ef4444";
}

export function methodColor(method: string): string {
  const map: Record<string, string> = {
    GET: "#3b82f6",
    POST: "#8b5cf6",
    PUT: "#f59e0b",
    DELETE: "#ef4444",
  };
  return map[method] ?? "#6b7280";
}
