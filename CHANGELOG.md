# 📜 Changelog

All notable changes to Dev Studio will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [1.1.0] — 2026-10-26

### Added

- **Health check endpoint** (`GET /api/health`) — reports database connectivity status, table count, and whether `auth_users` table exists. Returns 200 when healthy, 503 when degraded.
- **Backend build pipeline** — `tsconfig.build.json` and `npm run build` now compile TypeScript to `dist/` for Docker deployment. `npm run start:prod` runs the compiled output.
- **Docker multi-stage build** — New production `Dockerfile` with `deps` / `builder` / `production` stages using Node 22 Alpine. Only compiled output in the final image.
- **GitHub Container Registry (GHCR) publishing** — Every push to `main` builds and pushes a Docker image tagged with `latest`, branch name, and short SHA.
- **GitHub Release asset upload** — Published releases automatically attach `frontend-dist-<version>.tar.gz` and `backend-dist-<version>.tar.gz`.
- **Vercel deployment step** in CI/CD — `deploy.yml` deploys via Vercel CLI when `VERCEL_TOKEN` is configured in GitHub Secrets.
- **Accessibility issue template** — New YAML-structured GitHub issue template (`accessibility.yml`) for reporting barriers.
- **CONTRIBUTING.md** at repository root — GitHub-linked contributing guide with full setup, git conventions, pre-commit validation, and accessibility contributor expectations.
- **SUPPORT.md** — Centralized support guide covering all help channels and common setup issues.
- **ACCESSIBILITY.md** — Full accessibility statement covering WCAG 2.1 AA commitment, supported environments, known limitations, severity SLA, and contributor expectations.
- **Frontend unit tests** — New tests for `DeleteDialog` component and `createCrudActions` factory.
- **Integration test coverage** — `GET /api/enums` endpoint added to the integration test suite.

### Fixed

- **Auth 500 errors on register/login** — Root cause was missing `DATABASE_URL` on Vercel. Error responses now include `details` field with the underlying error message to aid diagnosis.
- **Auth 404 on `/auth` route** — Added `frontend/vercel.json` with SPA rewrite (`/(.*) → /index.html`) so client-side routes resolve correctly on hard refresh.
- **CORS `Not allowed by CORS` error** — Rewrote CORS config to allow `ms-dev-studio.vercel.app` and all `ms-dev-studio*.vercel.app` preview URLs. Also allows no-origin requests (Vercel same-domain rewrites) and added `OPTIONS` pre-flight fix (`optionsSuccessStatus: 204`).
- **Cookie not cleared on logout** — `clearCookie` now passes identical options (`httpOnly`, `secure`, `sameSite`, `path`) as the original `set-cookie` call so browsers correctly delete the session.
- **Delete dialog double-click guard** — `DeleteDialog` now prevents double-submission, disables Cancel while deleting, and keeps the dialog open on failure.
- **CRUD factory error propagation** — `createCrudActions` now re-throws errors after rollback so calling UI components (e.g., `DeleteDialog`) receive the rejection.
- **`createCrudActions` TypeScript generics** — Factory is now generic over state type `S` (defaults to `ForgeState`) fixing `TS2344` CI failures when used with test state types.
- **CI `tsc` command** — Fixed broken `npm exec --prefix -- tsc --noEmit --project <absolute-path>` to `node node_modules/typescript/bin/tsc --noEmit` with `working-directory`.
- **CI cancellation** — Added `concurrency: cancel-in-progress: true` to both `ci.yml` and `deploy.yml` to stop stale runs on rapid pushes.
- **Deploy workflow** — Removed broken Cloudflare deploy targeting; replaced with Vercel CLI deploy. Fixed root `npm ci` failure (no lockfile at root).
- **Database URL parsing** — Strips `sslmode` and `channel_binding` query params without corrupting the database name. Supabase pooler (`pgbouncer=true`) URLs are handled correctly.
- **Supabase TLS** — Auto-detects Supabase/Neon connection strings and applies `ssl: { rejectUnauthorized: false }` without requiring `sslmode=require` in the URL.
- **Prompts store payload mapping** — `toPayload` in the prompts slice no longer sends stale snake_case fields (`usage_count`, `user_id`).
- **`SoftAreaId` type** — `enums.ts` frontend API now correctly types `SOFT_AREA_ID` as `SoftAreaId` instead of `string`.
- **Production URL** — Updated all hardcoded `dev-studio-full.vercel.app` references to the actual deployment `ms-dev-studio.vercel.app`.

### Security

- **CORS hardening** — Production CORS now uses an allowlist + regex instead of a wildcard. Unknown origins are rejected.
- **Auth cookie options** — Logout now correctly clears the `httpOnly` cookie with matching attributes, preventing session persistence after sign-out.

---

## [1.0.0] — 2026-05-23

### Added

- **Activity log** — Every action (creating prompts, running agents, updating jobs, logging in) is silently recorded. Powers future history feed, undo support, and admin oversight.
- **Notifications system** — Foundation for in-app alerts with read/unread state and one-click deep-links. Covers events like agent completion, overdue planner tasks, and CV generation.

### Security

- Both features protected with Row-Level Security: users can only access their own activity and notifications. Server is the only write authority — no client-side tampering possible.

---

*Older history predates this changelog. Run `git log --oneline` to see full commit history.*

[Unreleased]: https://github.com/darkpyramid-org/Dev-Studio-Full/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/darkpyramid-org/Dev-Studio-Full/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/darkpyramid-org/Dev-Studio-Full/releases/tag/v1.0.0
