# Ramp architecture

Status: **skeleton (issue #1)**. The GitHub issues, milestones 1–7, are the source of truth for scope and contracts. This page summarizes them. Anything marked *planned* has no code yet.

## Components

```
┌──────────────┐ server-side fetch ┌──────────────┐
│   apps/web   │ ───────────────▶  │   apps/api   │──▶ Nebius Token Factory (Nemotron text + vision)
│  Next.js     │  API_BASE_URL     │   FastAPI    │──▶ Tavily (discovery, WCAG links)
│  :3000       │ ◀───────────────  │   :8000      │──▶ GitHub (clone, push, one PR)
└──────────────┘      JSON         └──────┬───────┘
                                          │ Playwright + axe-core (planned)
                                          ▼
                              target site, e.g. fixtures/demo-site (planned)
```

| Component | Implemented now | Planned |
|---|---|---|
| **apps/api** | `GET /health` → `{ "ok": true }`; CORS from `CORS_ORIGINS`; empty `app/pipeline/` package | Job models (`app/models.py`), SQLite store (`app/store.py`, `apps/api/data/ramp.db`), job endpoints, pipeline runner and steps |
| **apps/web** | "Ramp" heading; server-side API status check using `API_BASE_URL` | Start screen, live run view, results view |
| **fixtures/demo-site** | — | Static site with known bugs (issue #3) |

## Planned pipeline

Steps are stored on the job in this order: `map`, `detect`, `locate`, `fix`, `verify`, `pr`.

1. **map**: choose up to 10 pages (seed, crawl, sitemap, Tavily).
2. **detect**: open each page in Playwright and run axe-core.
3. **locate**: map each violation to one source file and line range, or skip it with a reason.
4. **fix**: Nemotron writes a small code change; a Nemotron vision model writes alt text.
5. **verify**: re-serve the patched site and re-run axe-core. A change is kept only if that violation is gone and the total count did not go up. One retry, then drop.
6. **pr**: open one GitHub pull request containing only kept changes.

Target axe rules: `html-has-lang`, `image-alt`, `label`, `link-name`, `button-name`, `color-contrast`.

## Rules

- axe-core decides what is broken and whether a fix worked. The model only writes the code change.
- Only owners in `ALLOWED_GITHUB_OWNERS` may be cloned or pushed to.
- Secrets come from the environment and are used only by the API. `API_BASE_URL` is read by the web server and never sent to the browser.
- API JSON is camelCase. There is one job shape, in `apps/api/app/models.py`. `workspacePath` is never returned by the API.
- Job workspaces live under `apps/api/data/workspaces/{job_id}` (git-ignored).
