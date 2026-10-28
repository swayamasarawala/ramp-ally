# Contributing to Ramp

## Branches

- `main` is always green and is only updated through reviewed pull requests.
- One branch per GitHub issue, named `issue-<number>-<short-name>` (e.g. `issue-2-job-api`). Branch from the latest `main`.
- Use `fix/<short-name>`, `docs/<short-name>`, or `chore/<short-name>` for work that isn't tied to an issue.
- Keep a branch focused on one change. Rebase on `main` before requesting review.

## Pull requests and reviews

- Open a **draft** PR early, and mark it ready when CI passes and it's self-reviewed.
- Every PR needs **one approving review from the other teammate** before merging. Don't merge your own PR without review.
- The PR description says what changed, why, how it was tested (actual commands and results), and what's left undone.
- All CI jobs must pass. Don't skip, disable, or loosen a meaningful test just to get a green check. If a test is wrong, fix it in a clearly explained commit.
- Prefer squash-merge, with a commit message that describes the change.

## Teammate workflow

1. `git switch main && git pull`
2. `git switch -c issue-<number>-<short-name>`, and assign the issue to yourself
3. Install and run the checks for the components you touch (see [README.md](README.md#checks)).
4. Commit small, coherent changes. Never commit `.env` files, tokens, or keys; only `.env.example` files with placeholders.
5. Push, open a draft PR that says `Closes #<number>`, and request review from your teammate.
6. Address review comments with new commits, so they're easy to re-review.
7. After approval and green CI, squash-merge and delete the branch.

Coordinate in the PR or issue before starting large changes to shared areas (API contracts, CI, the example app's defects), to avoid conflicting work.

## Project rules

- **Secrets stay server-side.** API keys belong only in the repo-root `.env` (git-ignored) and are used only by `apps/api`. Never in `apps/web` client code, `NEXT_PUBLIC_*` variables, logs, or commits.
- **No fabricated results.** The UI and docs must never show invented scans, model outputs, verification results, or benchmarks.
- **Follow the shared contract.** Field names, step order, and env names come from the issues. Don't invent a second job shape.
- **axe-core is the judge.** It decides what is broken and whether a fix worked; the model only writes the change.
- **Be honest about compliance.** Automated checks don't establish complete WCAG compliance; say so wherever results are presented.
- **Lockfiles are committed.** Use `npm ci` and `pip install -r requirements.lock`. Update lockfiles deliberately and mention it in the PR.
- Update [docs/api-contracts.md](docs/api-contracts.md) whenever an endpoint is added or changed.
