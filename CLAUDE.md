# CLAUDE.md

Guidance for AI coding agents working in this repository.

## Scope

Work is driven by the GitHub issues (milestones 1–7) in `swayamasarawala/ramp-ally`. **Do one issue at a time.** Follow its "Create", "Leave alone", and "Done when" sections and the shared contract repeated in every issue. Don't rename the layout. If a file already exists, extend it.

**Current state: issue #1 (skeleton).** `GET /health` and the web app's "Ramp" heading and API status exist. Not implemented: jobs, models, store, database, fixture site, Playwright/axe scanning, pipeline steps, Nebius, Tavily, GitHub PRs.

## Layout

- `apps/api/`: Python 3.12, FastAPI, pydantic v2. Env loaded from the repo-root `.env` via python-dotenv ([apps/api/app/config.py](apps/api/app/config.py)).
- `apps/web/`: Next.js 16 App Router + TypeScript + Tailwind 4. Read `apps/web/AGENTS.md`: this Next.js version differs from older training data, and docs are in `apps/web/node_modules/next/dist/docs/`. `cacheComponents` is on, so use `await connection()` inside `<Suspense>` for request-time work.
- `fixtures/demo-site/`: planned (issue #3).
- `docs/`: [architecture.md](docs/architecture.md), [api-contracts.md](docs/api-contracts.md).

## Commands

```bash
# API (from apps/api)
.venv/bin/uvicorn app.main:app --reload --port 8000
.venv/bin/ruff check . && .venv/bin/ruff format --check . && .venv/bin/pytest
# Web (from apps/web)
npm ci && npm run dev
npm run lint && npm run typecheck && npm run build
```

## Rules

- Never read, print, or commit credentials. Secrets come only from the environment (repo-root `.env`, git-ignored). `.env.example` has empty values only.
- `API_BASE_URL` is server-side only. Never expose it, or any secret, via `NEXT_PUBLIC_*`.
- axe-core decides what is broken and whether a fix worked; the model only writes the code change.
- API JSON is camelCase. There is one job shape, in `apps/api/app/models.py`. Never return `workspacePath`.
- Only owners in `ALLOWED_GITHUB_OWNERS` may be cloned or pushed to.
- Never fabricate model calls, scan results, verification outcomes, or benchmarks.
- Never disable or weaken meaningful tests to get green checks.
- Never claim automated checks establish complete WCAG compliance.
- Toolchain (Node 20.19.5, npm 10.8.2): TypeScript `~5.9.3`. If adding Playwright tooling on the Node side, `@axe-core/playwright` 4.14+ needs Node ≥ 22.12, and Vite 8 crashes npm 10.8.2. Report any needed global upgrade instead of making it.
- The Python `.gitignore` template ignores `lib/` and `build/` anywhere, so don't name source folders `lib`.
- Commit lockfiles (`apps/web/package-lock.json`, `apps/api/requirements.lock`).
- Don't commit, push, or open PRs unless asked.
