<div align="center">
  
# 🌌 Dev Studio

**Your ultimate personal AI-powered development hub & engineering workstation.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-ms--dev--studio.vercel.app-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://ms-dev-studio.vercel.app)

<br />

[![CI](https://github.com/darkpyramid-org/Dev-Studio-Full/actions/workflows/ci.yml/badge.svg)](https://github.com/darkpyramid-org/Dev-Studio-Full/actions/workflows/ci.yml)
[![Deploy](https://github.com/darkpyramid-org/Dev-Studio-Full/actions/workflows/deploy.yml/badge.svg)](https://github.com/darkpyramid-org/Dev-Studio-Full/actions/workflows/deploy.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express_5-404D59?style=flat-square)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)

Dev Studio provides a centralized, local-first control center to organize, version, test, and instantly run prompts, AI agents, React components, snippets, project templates, technical interview preparation, and career progress.

[Explore Live Demo](https://ms-dev-studio.vercel.app) · [Report Bug](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=bug_report.yml) · [Request Feature](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=feature_request.yml) · [Report Accessibility Issue](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=accessibility.yml)

</div>

---

## 🌟 Key Features

- 📝 **Prompt Engineering Studio** — Full library with variable parsing (`{{var}}`), parameter controls, version history, and tag filtering.
- 🤖 **AI Agents Hub** — Tailor custom autonomous agents with dynamic model selection, system instructions, temperature, and custom tooling.
- 🧩 **React Components Forge** — Interactive UI component showcase with live previews, prop controls, dependency maps, and styling presets.
- 📦 **Project Templates** — Scaffold starter structures with dynamic technology descriptors, dependency trees, and architecture layouts.
- 📎 **Multilingual Code Snippets** — Fast code catalog with smart language filters, searchable tags, and syntax highlighting.
- 🧠 **Technical Interview Prep** — Structured question bank across Frontend, Backend, DevOps, Databases, and Systems Design with difficulty tracking.
- 🛡️ **Engineering Career Checklist** — Progress tracker covering core competencies across software engineering domains.
- 👥 **Soft Skills & Communication Track** — Scenarios and frameworks covering active listening, crisis communication, and stakeholder management.
- 📢 **Social & Outreach Drafts** — Ready-to-use launch announcements, release notes, and email copy with token replacement.

---

## 🛠️ Tech Stack & Architecture

Dev Studio is built as a modular monorepo leveraging Clean Architecture:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| 🎨 **Frontend** | **React 19 & Vite** | Fast modern UI with reactive state and instant HMR |
| 🔀 **Routing** | **TanStack Router** | Type-safe, declarative file-based routing |
| 🔄 **Data Fetching** | **TanStack Query** | High-performance cache synchronization and query deduplication |
| 💾 **Client State** | **Zustand** | Predictable local and persisted stores |
| 💅 **Styling** | **Tailwind CSS v4** | Modern utility-first atomic styling |
| 🏗️ **Components** | **shadcn/ui & Radix** | Accessible, responsive, and composable UI primitives |
| ⚙️ **Backend** | **Express 5** | High-throughput Node.js backend using Clean Architecture |
| ⚡ **ORM** | **Drizzle ORM** | Type-safe database queries, schema declarations, and migrations |
| 🗄️ **Database** | **PostgreSQL / Supabase** | Relational storage with connection pooling |
| 🔐 **Auth** | **Supabase Auth** | Secure session handling, magic links, and OAuth flows |
| 🧪 **Testing** | **Vitest** | Comprehensive unit, integration, and store tests |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** `>= 20.x`
- **npm** `>= 10.x`
- **PostgreSQL** `>= 15.x` (or Supabase account / Docker)

### 2. Clone the Repository
```bash
git clone https://github.com/darkpyramid-org/Dev-Studio-Full.git
cd Dev-Studio-Full
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Copy `.env.example` in both `frontend` and `backend`:
```bash
# Frontend configuration
cp frontend/.env.example frontend/.env

# Backend configuration
cp backend/.env.example backend/.env
```

### 5. Run the Application
Start both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

---

## 🧪 Validation & Testing

Run automated quality checks across the entire monorepo:

```bash
# Type check both frontend and backend
npm run typecheck

# Run test suites
npm test

# Build production bundles
npm run build
```

---

## 📜 Community & Governance

Dev Studio is committed to high engineering standards, inclusive community guidelines, and active maintenance:

- 🤝 **[Contributing Guide](./CONTRIBUTING.md)** — Step-by-step instructions for opening PRs, commit format, and local workflows.
- 🌟 **[Code of Conduct](./CODE_OF_CONDUCT.md)** — Standards and enforcement ensuring a welcoming community for everyone.
- 🛡️ **[Security Policy](./SECURITY.md)** — Guidelines for reporting vulnerabilities responsibly.
- ♿ **[Accessibility Statement](./ACCESSIBILITY.md)** — WCAG 2.1 AA conformance commitment and barrier reporting.
- 🆘 **[Support](./SUPPORT.md)** — How to get help, find documentation, and contact maintainers.
- 🏛️ **[Project Governance](./GOVERNANCE.md)** — Maintainer responsibilities, roadmap steering, and decision processes.
- 📜 **[Changelog](./CHANGELOG.md)** — Version history and release notes.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) © 2026 Dev Studio Contributors.
