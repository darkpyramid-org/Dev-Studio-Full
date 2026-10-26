export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    let errorMessage = `API error ${res.status}`;
    try {
      const parsed = JSON.parse(text);
      if (parsed.detail) {
        errorMessage = `${parsed.error || "Error"}: ${parsed.detail}`;
      } else if (parsed.error) {
        errorMessage = parsed.error;
      }
    } catch {
      errorMessage = `${errorMessage}: ${text}`;
    }
    throw new Error(errorMessage);
  }
  return res.json() as T;
}

/**
 * POST JSON and parse the response, throwing on non-OK responses.
 *
 * The thrown error carries the parsed body (`data`) and HTTP `status` so
 * callers can act on structured payloads even for failed responses
 * (e.g. the auth verify-email flow piggybacks on 403 responses).
 */
export async function apiPost<T = Record<string, unknown>>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  let data: T | null = null;
  let text = "";
  try {
    data = (await res.json()) as T;
  } catch {
    text = await res.text().catch(() => "");
  }

  if (!res.ok) {
    const err = new Error(
      (data as Record<string, unknown> | null)?.error as string ||
        (data as Record<string, unknown> | null)?.message as string ||
        text.trim() ||
        `Server error (${res.status})`,
    ) as Error & { data: T | null; status: number };
    err.data = data;
    err.status = res.status;
    throw err;
  }

  return data as T;
}
