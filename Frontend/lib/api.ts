const API_BASE = "http://localhost:3001";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      let errorMsg = res.statusText;
      try {
        const errorData = await res.json();
        if (errorData.message) errorMsg = errorData.message;
      } catch {}
      throw new Error(errorMsg);
    }

    return res.json();
  } catch (err) {
    console.error(`Fetch failed for ${url}:`, err);
    throw err;
  }
}
