# 🆘 Support

> [!NOTE]
> This document explains how to get help with Dev Studio. Please read through the options below before opening an issue.

---

## 🔍 Before Asking for Help

1. **Check the documentation** — Start with the [docs/](./docs/README.md) folder:
   - [Setup Guide](./docs/setup/README.md)
   - [Environment Variables](./docs/setup/ENVIRONMENT.md)
   - [Architecture Overview](./docs/architecture/README.md)

2. **Search existing issues** — Your question may already be answered:
   - [Open Issues](https://github.com/darkpyramid-org/Dev-Studio-Full/issues)
   - [Closed Issues](https://github.com/darkpyramid-org/Dev-Studio-Full/issues?q=is%3Aissue+is%3Aclosed)

3. **Check the Changelog** — Recent fixes may address your problem:
   - [CHANGELOG.md](./CHANGELOG.md)

---

## 💬 How to Get Help

### 🐛 Bug Reports
Something broken? [Open a Bug Report →](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=bug_report.md)

Include: steps to reproduce, expected vs actual behavior, environment details (OS, Node version, browser).

### ✨ Feature Requests
Have an idea? [Open a Feature Request →](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=feature_request.md)

### ♿ Accessibility Issues
Encountered a barrier? [Open an Accessibility Issue →](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=accessibility.yml)

Or email **m.ssaid356@gmail.com** — no disability disclosure required.

### 🔒 Security Vulnerabilities
**Do NOT open a public issue.** See [SECURITY.md](./.github/SECURITY.md) for private reporting instructions.

### 💬 General Questions & Discussions
For "how do I...?" questions, ideas, or general conversation:
[Start a Discussion →](https://github.com/darkpyramid-org/Dev-Studio-Full/discussions)

---

## ⚙️ Common Setup Issues

| Problem | Solution |
|---------|---------|
| `Cannot connect to database` | Set `DATABASE_URL` in `backend/.env` — see [ENVIRONMENT.md](./docs/setup/ENVIRONMENT.md) |
| `api/auth/login 500 error` | Database not migrated — run `npm run db:push --prefix backend` |
| `Not allowed by CORS` | Set `FRONTEND_URL` env var in your Vercel backend settings |
| `auth:1 Failed to load 404` | Frontend SPA routing — ensure `frontend/vercel.json` rewrites are deployed |
| `tsc --noEmit` CI failure | Run `node node_modules/typescript/bin/tsc --noEmit` locally first |

---

## 📬 Direct Contact

For private matters (security, licensing, partnerships):
**Email:** m.ssaid356@gmail.com
**Subject prefix:** `[Dev Studio] Your Subject Here`

Response time: within **48 hours** on business days.

---

## 🤝 Contributing

Want to fix a bug or add a feature yourself? See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.
