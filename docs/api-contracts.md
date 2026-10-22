# Ramp API contracts

Base URL (local): `http://localhost:8000`. The shared contract in the GitHub issues is authoritative; update this page whenever an endpoint lands.

## Implemented

### `GET /health`

Liveness check. Calls no external service.

**200 OK**

```json
{ "ok": true }
```

**CORS:** browser requests are allowed only from origins in `CORS_ORIGINS` (comma-separated; default `http://localhost:3000`).

Source: [apps/api/app/main.py](../apps/api/app/main.py). Tests: [apps/api/tests/test_health.py](../apps/api/tests/test_health.py).

## Planned (not implemented)

From issue #2. These are **not** working endpoints yet.

| Method & path | Purpose |
|---|---|
| `POST /jobs` | Body `{ "siteUrl", "repoUrl" }`. Both must be http(s); `repoUrl` must be a github.com repo (else 400). Creates the job, starts the pipeline in a background task, and returns the job with status `running`. |
| `GET /jobs/{id}` | Returns the job JSON; unknown id → 404. |

Public job JSON (camelCase; `workspacePath` is never returned):

- `id`, `siteUrl`, `repoUrl`, `status` (`pending | running | done | failed`), `error`, `beforeCount`, `afterCount`, `prUrl`, `createdAt`, `updatedAt`
- `steps.map|detect|locate|fix|verify|pr`: `{ status: pending | running | done | failed, detail: string }`
- `pages[]`: `{ url, source: seed | crawl | sitemap | tavily }`
- `violations[]`: `{ id, pageUrl, ruleId, impact, selector, html, description, helpUrl, location: { file, startLine, endLine } | null, skipReason: string | null }`
- `fixes[]`: `{ id, violationId, ruleId, file, summary, wcagUrl, wcagSummary, status: pending | kept | dropped, attempts, dropReason: string | null }`
