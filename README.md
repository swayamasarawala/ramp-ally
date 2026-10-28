# ramp-ally

An AI agent that detects website accessibility issues, generates code fixes, verifies them, and opens GitHub pull requests.

Ramp takes a website URL and a GitHub repository, finds accessibility bugs with Playwright and axe-core, and asks NVIDIA Nemotron (hosted on Nebius Token Factory) to write a small source change for each one. A Nemotron vision model writes alt text. Ramp then re-runs axe-core to prove each change worked, keeps only the changes that did, and opens one pull request. axe-core decides what is broken and whether a fix worked; the model only writes the code change. A human still reviews and merges. Automated checks don't establish full WCAG compliance.

> **Status:** project skeleton (issue #1). The API serves `GET /health` and the web app shows the "Ramp" heading and the API connection status. The pipeline, jobs, database, and scanning are later issues.

## Layout

| Path | What it is | Port |
|---|---|---|
| [apps/api/](apps/api/) | Python 3.12, FastAPI, pydantic v2. Runs the pipeline (later). | 8000 |
| [apps/web/](apps/web/) | Next.js App Router, TypeScript, Tailwind. The dashboard. | 3000 |
| `fixtures/demo-site/` | Static site with known bugs (issue #3, not created yet) | — |
| [docs/](docs/) | Architecture and API contracts | — |

## Prerequisites

- Python 3.12 (`python3.12 --version`)
- Node.js 20.19.5 (see [.nvmrc](.nvmrc); `nvm use`) with npm 10.8+

## Setup

```bash
git clone https://github.com/swayamasarawala/ramp-ally.git
cd ramp-ally
cp .env.example .env   # optional for now; every value may stay empty
```

`.env` is git-ignored. Never commit real keys.

### API (port 8000)

```bash
cd apps/api
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.lock
pip install --no-deps -e .
uvicorn app.main:app --reload --port 8000
```

Check it: `curl http://localhost:8000/health` returns `{"ok":true}`.

### Web app (port 3000)

In a second terminal:

```bash
cd apps/web
npm ci
npm run dev
```

Open http://localhost:3000 to see the **Ramp** heading and the API status. The web server reads `API_BASE_URL` from its environment (default `http://localhost:8000`) and calls the API server-side; the value is never sent to the browser. To override it, set it in the shell or in `apps/web/.env.local`.

### Later: browser for scanning

The detect step (issue #4) will need Chromium for Playwright. When that lands, run:

```bash
playwright install chromium
```

## Checks

These match CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)):

```bash
cd apps/api && .venv/bin/ruff check . && .venv/bin/ruff format --check . && .venv/bin/pytest
cd apps/web && npm run lint && npm run typecheck && npm run build
```

## Environment variables

All of them are listed with a one-line comment in [.env.example](.env.example): `NEBIUS_API_KEY`, `NEBIUS_BASE_URL`, `NEMOTRON_TEXT_MODEL`, `NEMOTRON_VISION_MODEL`, `TAVILY_API_KEY`, `GITHUB_TOKEN`, `ALLOWED_GITHUB_OWNERS`, `CORS_ORIGINS`, `API_BASE_URL`. Only `CORS_ORIGINS` (API) and `API_BASE_URL` (web) are read so far. Secrets are used only by the API.

## More

- [docs/architecture.md](docs/architecture.md): components and the pipeline
- [docs/api-contracts.md](docs/api-contracts.md): implemented vs. planned endpoints
- [CONTRIBUTING.md](CONTRIBUTING.md): branches, reviews, teammate workflow
- [CLAUDE.md](CLAUDE.md): scope and rules for AI coding agents

## License

[MIT](LICENSE)
