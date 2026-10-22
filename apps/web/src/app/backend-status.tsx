import { connection } from "next/server";

// Server-only. Read per request, never inlined into browser JavaScript.
const DEFAULT_API_BASE_URL = "http://localhost:8000";

type Result = { ok: true } | { ok: false; reason: string };

async function checkHealth(apiBaseUrl: string): Promise<Result> {
  try {
    const res = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const body = (await res.json()) as { ok?: unknown };
    return body.ok === true
      ? { ok: true }
      : { ok: false, reason: "unexpected response" };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "unknown error",
    };
  }
}

export async function BackendStatus() {
  await connection();
  const apiBaseUrl = process.env.API_BASE_URL || DEFAULT_API_BASE_URL;
  const result = await checkHealth(apiBaseUrl);

  return (
    <p role="status" className="mt-3 font-medium">
      {result.ok ? (
        <>
          <span aria-hidden="true">●</span> API connected ({apiBaseUrl})
        </>
      ) : (
        <>
          <span aria-hidden="true">○</span> API unreachable at {apiBaseUrl} (
          {result.reason}). Start it with the commands in the README.
        </>
      )}
    </p>
  );
}
