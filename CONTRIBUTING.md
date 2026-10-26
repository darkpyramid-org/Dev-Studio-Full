# 🤝 Contributing to Dev Studio

> [!NOTE]
> Thank you for taking the time to contribute to Dev Studio! We want to make contributing as transparent, productive, and welcoming as possible. Please read through this guide before opening an issue or pull request.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Git Conventions](#-git-conventions)
- [Pre-commit Validation](#-pre-commit-validation)
- [Pull Request Process](#-pull-request-process)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)
- [Accessibility Contributions](#-accessibility-contributions)

---

## 📜 Code of Conduct

This project is governed by our [Code of Conduct](./.github/CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards. Please report unacceptable behavior to **m.ssaid356@gmail.com**.

---

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Dev-Studio-Full.git
   cd Dev-Studio-Full
   ```
3. **Set upstream** remote:
   ```bash
   git remote add upstream https://github.com/darkpyramid-org/Dev-Studio-Full.git
   ```
4. Create a **feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 🛠️ Development Setup

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 20.x |
| npm | 10.x |
| PostgreSQL | 15.x (or Supabase account) |

### Install & Run

```bash
# Install all dependencies
npm ci --prefix frontend
npm ci --prefix backend

# Copy and configure environment
cp backend/.env.example backend/.env
# → Set DATABASE_URL and JWT_SECRET in backend/.env

# Run database migrations
npm run db:push --prefix backend

# Start development servers (both concurrently)
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 📂 Git Conventions

### 🌿 Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| ✨ Feature | `feature/short-description` | `feature/prompt-versioning` |
| 🐛 Bug Fix | `fix/short-description` | `fix/auth-cookie-options` |
| 📝 Docs | `docs/short-description` | `docs/update-architecture` |
| ♻️ Refactor | `refactor/short-description` | `refactor/clean-routes` |
| 🔒 Security | `security/short-description` | `security/cors-hardening` |

### 📝 Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short imperative summary>

[optional body explaining WHY, not WHAT]
```

**Types:** `feat` · `fix` · `docs` · `refactor` · `test` · `chore` · `security` · `perf`

```bash
# Examples
feat: add version history panel for prompts
fix: resolve JWT cookie not cleared on logout
docs: document Supabase environment variables
test: add integration tests for auth flow
security: harden CORS to allow only ms-dev-studio.vercel.app
```

---

## 🔍 Pre-commit Validation

All checks must pass before pushing or opening a PR:

```bash
# Lint
npm run lint:frontend

# TypeScript type check
node frontend/node_modules/typescript/bin/tsc --noEmit --project frontend/tsconfig.json
node backend/node_modules/typescript/bin/tsc --noEmit --project backend/tsconfig.json

# Tests
npm run test:frontend
npm run test:backend

# Production build
npm run build:frontend
npm run build:backend
```

> [!TIP]
> The CI pipeline runs all of these automatically. Fixing them locally saves time before pushing.

---

## 🔃 Pull Request Process

1. Ensure your branch is **up-to-date** with `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. Push your branch and open a **Pull Request** against `main`
3. Fill in the [PR template](./.github/pull_request_template.md) completely
4. Link any related issues using `Closes #<issue-number>`
5. A maintainer will review within **3 business days**
6. Address all review comments; do not force-push after review starts
7. Once approved, a maintainer will **squash-merge** your PR

---

## 🐛 Reporting Bugs

Use the [Bug Report template](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=bug_report.md).

Please include:
- Steps to reproduce (minimal, exact)
- Expected vs actual behavior
- Environment: OS, browser, Node version
- Console errors / screenshots if applicable

> [!IMPORTANT]
> For **security vulnerabilities**, do NOT open a public issue. See [SECURITY.md](./.github/SECURITY.md).

---

## 💡 Suggesting Features

Use the [Feature Request template](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=feature_request.md).

Good feature requests include:
- The **problem** it solves or the **user need** it addresses
- A proposed **solution** or approach
- Any **alternatives** considered

---

## ♿ Accessibility Contributions

Dev Studio is committed to WCAG 2.1 AA compliance. When contributing UI changes:

- Ensure all interactive elements have visible focus indicators
- All images and icons must have meaningful `alt` text or `aria-label`
- Test keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- Maintain color contrast ratio ≥ 4.5:1 for normal text
- Do not rely on color alone to convey information
- Announce dynamic content changes with `aria-live` regions where appropriate

Report accessibility barriers via the [Accessibility Issue template](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=accessibility.yml) or email **m.ssaid356@gmail.com**.

See the full [Accessibility Statement](./ACCESSIBILITY.md).

---

## 📬 Questions?

- Open a [Discussion](https://github.com/darkpyramid-org/Dev-Studio-Full/discussions) for general questions
- Email **m.ssaid356@gmail.com** for private matters

Thank you for making Dev Studio better! 🙏
