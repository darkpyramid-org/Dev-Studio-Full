import type { ConnectorType } from "../../../domain/enums.js";

const now = Date.now();
const d = (days: number) => now - 86400000 * days;

export interface ConnectorSeed {
  id: string;
  type: ConnectorType;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  category?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export const seedConnectors: ConnectorSeed[] = [
  // ── Companies ─────────────────────────────────────────────────────────────
  {
    id: "conn_1",
    type: "companies",
    name: "Stripe",
    email: "partnerships@stripe.com",
    notes: "Payment infra. Contact for startup credits. API-first, excellent docs.",
    createdAt: d(60),
    updatedAt: d(5),
  },
  {
    id: "conn_2",
    type: "companies",
    name: "Vercel",
    email: "sales@vercel.com",
    notes: "Frontend cloud. Sponsor tier available for OSS projects.",
    createdAt: d(45),
    updatedAt: d(10),
  },
  {
    id: "conn_3",
    type: "companies",
    name: "PlanetScale",
    email: "hello@planetscale.com",
    notes: "Serverless MySQL. Great branching workflow for DB migrations.",
    createdAt: d(30),
    updatedAt: d(20),
  },

  // ── HR Contacts ───────────────────────────────────────────────────────────
  {
    id: "conn_4",
    type: "hr",
    name: "Sarah Chen — TechCorp HR",
    email: "s.chen@techcorp.io",
    phone: "+1 415 555 0100",
    notes: "Recruiter for senior eng roles. Prefers initial contact via email. Replied within 24h last time.",
    createdAt: d(14),
    updatedAt: d(2),
  },
  {
    id: "conn_5",
    type: "hr",
    name: "Marcus Webb — DevHire",
    email: "marcus@devhire.co",
    notes: "Specialized in remote-first startups. Focuses on React/Node stack roles. Met at ReactConf.",
    createdAt: d(20),
    updatedAt: d(7),
  },
  {
    id: "conn_6",
    type: "hr",
    name: "Priya Nair — ScaleUp Talent",
    email: "priya.nair@scaleup.io",
    phone: "+44 20 7946 0123",
    notes: "UK + remote roles. Fintech and B2B SaaS focus. Quick to respond on LinkedIn.",
    createdAt: d(10),
    updatedAt: d(1),
  },

  // ── Clients ───────────────────────────────────────────────────────────────
  {
    id: "conn_7",
    type: "clients",
    name: "Alex Rivera — SoloFounder.io",
    email: "alex@solofounder.io",
    notes: "Indie hacker. Needs help with full-stack features monthly. Pays on time. Slack-based comms.",
    createdAt: d(90),
    updatedAt: d(3),
  },
  {
    id: "conn_8",
    type: "clients",
    name: "Nimbus Analytics",
    email: "dev@nimbusanalytics.com",
    phone: "+1 628 555 0199",
    notes: "Dashboard redesign project. Needs data viz expertise. Decision-maker: CTO Leo Park.",
    createdAt: d(25),
    updatedAt: d(4),
  },
  {
    id: "conn_9",
    type: "clients",
    name: "Bloom Studio",
    email: "studio@bloom.design",
    notes: "Design agency. Subcontracts dev work. Prefers fixed-price. Good for filler work between projects.",
    createdAt: d(50),
    updatedAt: d(15),
  },

  // ── Freelance Contacts ────────────────────────────────────────────────────
  {
    id: "conn_10",
    type: "freelance",
    name: "Upwork Enterprise Client",
    email: "enterprise-client@upwork.com",
    notes: "Direct contract for React/Node.js architecture audit. High hourly rate.",
    createdAt: d(20),
    updatedAt: d(2),
  },
  {
    id: "conn_11",
    type: "freelance",
    name: "Mostaql SaaS Founder",
    email: "founder@techventure.io",
    notes: "MVP build for marketplace platform. Looking for fullstack development.",
    createdAt: d(15),
    updatedAt: d(1),
  },

  // ── Services (What I Can Do & Budgets) ───────────────────────────────────
  {
    id: "srv_seo",
    type: "services",
    name: "Search Engine Optimization (SEO)",
    category: "Marketing & SEO",
    email: "$450 - $1,200",
    phone: "5 - 7 business days",
    tags: ["SEO", "Google Search Console", "Schema.org", "Core Web Vitals", "Keywords"],
    notes: JSON.stringify({
      description: "Comprehensive SEO audit and optimization to rank higher on Google, Bing, and AI search engines.",
      budget: "$450 - $1,200",
      pricingType: "fixed",
      deliveryTime: "5 - 7 business days",
      whatICanDo: [
        "Full technical SEO audit (crawl errors, indexing, redirects, 404s)",
        "Keyword research, search intent mapping & competitor gap analysis",
        "On-page optimization: Title tags, meta descriptions, headings (H1-H6)",
        "OpenGraph, Twitter Cards & structured Schema.org JSON-LD microdata",
        "Core Web Vitals acceleration (LCP, FID/INP, CLS scores 90+)",
        "XML sitemaps, robots.txt & Google Search Console indexing setup"
      ]
    }),
    createdAt: d(30),
    updatedAt: d(2),
  },
  {
    id: "srv_domin",
    type: "services",
    name: "Domain & DNS Configuration",
    category: "Infrastructure & DevOps",
    email: "$150 - $350",
    phone: "1 - 2 business days",
    tags: ["DNS", "Cloudflare", "SSL/TLS", "DKIM/SPF", "Domains"],
    notes: JSON.stringify({
      description: "Zero-downtime domain connection, DNS record setup, secure SSL certificates, and email deliverability hardening.",
      budget: "$150 - $350",
      pricingType: "fixed",
      deliveryTime: "1 - 2 business days",
      whatICanDo: [
        "Connect custom domains to Vercel, Netlify, AWS, VPS, or Shopify",
        "Configure DNS records: A, AAAA, CNAME, ALIAS, TXT, MX, CAA",
        "Cloudflare setup: Fast CDN edge caching, WAF rules & DDoS shielding",
        "Free auto-renewing SSL/TLS certificates (Let's Encrypt / Cloudflare Edge)",
        "Email verification: SPF, DKIM, and DMARC records to prevent spam folder delivery",
        "Subdomain routing and reverse-proxy port forwarding"
      ]
    }),
    createdAt: d(28),
    updatedAt: d(3),
  },
  {
    id: "srv_responsive",
    type: "services",
    name: "Responsive Web Design & Mobile-First",
    category: "Frontend Development",
    email: "$300 - $800",
    phone: "3 - 5 business days",
    tags: ["Responsive", "Mobile-First", "Tailwind CSS", "Flexbox/Grid", "Cross-Browser"],
    notes: JSON.stringify({
      description: "Pixel-perfect mobile, tablet, and desktop responsive optimization with fluid layouts and touch-friendly UI.",
      budget: "$300 - $800",
      pricingType: "fixed",
      deliveryTime: "3 - 5 business days",
      whatICanDo: [
        "Audit existing layouts across mobile phones, tablets, laptops, and ultra-wide screens",
        "Eliminate horizontal scrollbars, clipped text, and broken flexbox/grid layouts",
        "Touch-optimized controls (swipe gestures, bottom sheets, mobile drawers)",
        "Adaptive imagery and responsive video embeds for fast mobile loading",
        "Cross-browser testing (iOS Safari, Android Chrome, Desktop Chrome, Firefox, Edge)"
      ]
    }),
    createdAt: d(26),
    updatedAt: d(4),
  },
  {
    id: "srv_security",
    type: "services",
    name: "Web Security & Vulnerability Auditing",
    category: "Security & Compliance",
    email: "$600 - $1,800",
    phone: "4 - 7 business days",
    tags: ["Cybersecurity", "OWASP", "CSP & Headers", "Rate Limiting", "Auth Security"],
    notes: JSON.stringify({
      description: "Thorough security audit, penetration testing simulations, and defensive hardening against attacks and data leaks.",
      budget: "$600 - $1,800",
      pricingType: "fixed",
      deliveryTime: "4 - 7 business days",
      whatICanDo: [
        "OWASP Top 10 vulnerability assessment (SQLi, XSS, CSRF, SSRF prevention)",
        "Security HTTP headers implementation (strict CSP, HSTS, X-Frame-Options, CORS)",
        "API rate limiting, bot protection, and DDoS prevention",
        "Authentication hardening: Secure JWT cookies, bcrypt salt, session revocation",
        "NPM dependency audit, secret key leak scanning, and automated fix scripts"
      ]
    }),
    createdAt: d(24),
    updatedAt: d(1),
  },
  {
    id: "srv_ui_ux",
    type: "services",
    name: "UI / UX Design & Design Systems",
    category: "Design & UI/UX",
    email: "$500 - $1,500",
    phone: "5 - 10 business days",
    tags: ["Figma", "Design System", "UI Design", "UX Research", "Wireframing"],
    notes: JSON.stringify({
      description: "Modern, high-converting product interfaces, clickable Figma prototypes, and scalable tokenized design systems.",
      budget: "$500 - $1,500",
      pricingType: "fixed",
      deliveryTime: "5 - 10 business days",
      whatICanDo: [
        "Figma high-fidelity interactive component designs and clickable prototypes",
        "Design systems creation: Typography scales, color palettes, spacing tokens",
        "User flow mapping, information architecture, and low-fidelity wireframing",
        "Dark mode & Light mode theme styling with seamless contrast",
        "Developer handoff documentation with CSS tokens and exported SVG assets"
      ]
    }),
    createdAt: d(22),
    updatedAt: d(2),
  },
  {
    id: "srv_landing",
    type: "services",
    name: "High-Converting Landing Pages",
    category: "Marketing & Growth",
    email: "$400 - $1,000",
    phone: "3 - 5 business days",
    tags: ["Landing Page", "Conversion Rate", "SaaS UI", "Lead Capture", "Hero Section"],
    notes: JSON.stringify({
      description: "High-impact SaaS and product landing pages engineered to captivate visitors and convert them into paying users.",
      budget: "$400 - $1,000",
      pricingType: "fixed",
      deliveryTime: "3 - 5 business days",
      whatICanDo: [
        "Compelling hero section with value proposition, social proof, and primary CTA",
        "Interactive feature grids, benefit callouts, and animated product previews",
        "Transparent pricing comparison tables with toggle billing (Monthly / Annual)",
        "FAQ accordions, customer testimonials carousel, and lead capture forms",
        "Sub-1-second initial page load with WebP images and minimal JavaScript bundles"
      ]
    }),
    createdAt: d(20),
    updatedAt: d(3),
  },
  {
    id: "srv_manage_server",
    type: "services",
    name: "Server Management & Cloud DevOps",
    category: "Infrastructure & DevOps",
    email: "$350 - $1,200",
    phone: "3 - 6 business days",
    tags: ["DevOps", "Docker", "Linux", "Nginx", "GitHub Actions", "AWS"],
    notes: JSON.stringify({
      description: "Production Linux server administration, Docker container orchestration, CI/CD automated deployments, and 24/7 monitoring.",
      budget: "$350 - $1,200",
      pricingType: "fixed",
      deliveryTime: "3 - 6 business days",
      whatICanDo: [
        "Linux VPS setup & security hardening (Ubuntu/Debian on AWS, Hetzner, DigitalOcean)",
        "Docker containerization with multi-stage builds and Docker Compose clustering",
        "Nginx / Caddy reverse proxy setup, HTTP/2 or HTTP/3, and automatic SSL",
        "CI/CD deployment pipelines using GitHub Actions for automated push-to-deploy",
        "Automated database backups (daily offsite S3 sync), log rotation, and uptime alerts"
      ]
    }),
    createdAt: d(18),
    updatedAt: d(4),
  },
  {
    id: "srv_payment",
    type: "services",
    name: "Payment Gateway & Checkout Integration",
    category: "E-Commerce & Backend",
    email: "$500 - $1,400",
    phone: "4 - 6 business days",
    tags: ["Stripe", "PayPal", "Webhooks", "Subscriptions", "Checkout"],
    notes: JSON.stringify({
      description: "Secure, frictionless payment integrations supporting credit cards, digital wallets, recurring subscriptions, and invoicing.",
      budget: "$500 - $1,400",
      pricingType: "fixed",
      deliveryTime: "4 - 6 business days",
      whatICanDo: [
        "Stripe Checkout, Custom Payment Elements, and Apple Pay / Google Pay setup",
        "PayPal, LemonSqueezy, or Paddle integrations for international sales",
        "Recurring subscription management: upgrades, downgrades, cancellations, proration",
        "Idempotent webhook handlers for charge.succeeded, invoice.paid, dispute notifications",
        "Automated customer PDF invoice delivery and self-serve billing portal"
      ]
    }),
    createdAt: d(16),
    updatedAt: d(1),
  },
  {
    id: "srv_ai_build",
    type: "services",
    name: "Build & Edit with AI (AI Tools & Agents)",
    category: "AI & Innovation",
    email: "$700 - $2,200",
    phone: "5 - 10 business days",
    tags: ["OpenAI", "Claude", "LLM", "Prompt Engineering", "RAG", "Automation"],
    notes: JSON.stringify({
      description: "Custom AI agent development, LLM integrations (OpenAI/Anthropic/Gemini), intelligent document search, and workflow automation.",
      budget: "$700 - $2,200",
      pricingType: "fixed",
      deliveryTime: "5 - 10 business days",
      whatICanDo: [
        "Integrate OpenAI ChatGPT, Anthropic Claude, or Google Gemini APIs into your web app",
        "Retrieval-Augmented Generation (RAG) with vector embeddings (pgvector, Pinecone)",
        "Smart AI assistant / chatbot customized to your company documents and FAQs",
        "Automated AI text editing, summarization, translation, and code generation tools",
        "Prompt engineering, token optimization, and streaming response UI with markdown"
      ]
    }),
    createdAt: d(14),
    updatedAt: d(2),
  },
  {
    id: "srv_multi_lang",
    type: "services",
    name: "Multi-Language Localization (i18n & RTL)",
    category: "Frontend Development",
    email: "$350 - $900",
    phone: "3 - 5 business days",
    tags: ["i18n", "Localization", "RTL/LTR", "Translation", "Internationalization"],
    notes: JSON.stringify({
      description: "Seamless multi-language translation architecture with Right-to-Left (RTL) Arabic/Hebrew layout mirroring and locale detection.",
      budget: "$350 - $900",
      pricingType: "fixed",
      deliveryTime: "3 - 5 business days",
      whatICanDo: [
        "Configure i18next, react-intl, or next-intl localization frameworks",
        "Right-to-Left (RTL) mirror styling for Arabic, Hebrew, and Persian layouts",
        "Automatic visitor language detection with manual language switch dropdown",
        "Localized URL routes (e.g. /en/, /ar/, /fr/, /es/) with hreflang tags for SEO",
        "Number, currency, date, and pluralization rule formatting for each locale"
      ]
    }),
    createdAt: d(12),
    updatedAt: d(3),
  },
  {
    id: "srv_accessibility",
    type: "services",
    name: "Web Accessibility Audit & WCAG Compliance (a11y)",
    category: "Security & Compliance",
    email: "$400 - $1,100",
    phone: "4 - 6 business days",
    tags: ["a11y", "WCAG 2.1", "Screen Readers", "ARIA", "Keyboard Nav"],
    notes: JSON.stringify({
      description: "Comprehensive WCAG 2.1 AA/AAA accessibility remediation ensuring compliance, keyboard navigability, and screen reader compatibility.",
      budget: "$400 - $1,100",
      pricingType: "fixed",
      deliveryTime: "4 - 6 business days",
      whatICanDo: [
        "Axe-core and Lighthouse accessibility compliance audit across all pages",
        "Full keyboard navigation: Focus traps, logical tab orders, visible focus rings",
        "Screen reader optimization: ARIA labels, role attributes, live announcement regions",
        "Color contrast audits conforming to WCAG AA (4.5:1 ratio) and AAA standards",
        "Skip-to-content links and accessible form error states with voice narration"
      ]
    }),
    createdAt: d(10),
    updatedAt: d(1),
  },
  {
    id: "srv_usability",
    type: "services",
    name: "Usability Testing & UX Auditing",
    category: "Design & UI/UX",
    email: "$350 - $950",
    phone: "3 - 5 business days",
    tags: ["Usability", "Heuristics", "User Research", "UX Audit", "Conversion"],
    notes: JSON.stringify({
      description: "Nielsen Norman heuristic evaluation, friction point discovery, and actionable user experience optimization to increase retention.",
      budget: "$350 - $950",
      pricingType: "fixed",
      deliveryTime: "3 - 5 business days",
      whatICanDo: [
        "Heuristic UX evaluation based on 10 Nielsen Norman usability principles",
        "Friction point identification causing signup drop-offs and checkout abandonment",
        "Form usability redesign: inline validation, smart autocompletion, clear error messages",
        "Information architecture, intuitive navigation taxonomy, and breadcrumbs",
        "Comprehensive PDF/Figma audit report with prioritized high-impact quick wins"
      ]
    }),
    createdAt: d(8),
    updatedAt: d(2),
  },
  {
    id: "srv_backlinks",
    type: "services",
    name: "Backlinks & High-Authority Link Building",
    category: "Marketing & SEO",
    email: "$500 - $1,600",
    phone: "7 - 14 business days",
    tags: ["Backlinks", "Off-Page SEO", "Link Building", "Domain Authority", "PR"],
    notes: JSON.stringify({
      description: "High-authority do-follow backlink acquisition and digital PR strategy to elevate domain authority and organic Google ranking.",
      budget: "$500 - $1,600",
      pricingType: "fixed",
      deliveryTime: "7 - 14 business days",
      whatICanDo: [
        "Competitor backlink gap analysis using Ahrefs and Semrush methodology",
        "Outreach to high Domain Authority (DA 40+) industry blogs and publications",
        "Tech ecosystem directory submissions (Product Hunt, BetaList, AlternativeTo)",
        "Curated GitHub awesome-list placements and developer resource inclusion",
        "Broken link reclamation and toxic backlink auditing with Google Disavow file"
      ]
    }),
    createdAt: d(6),
    updatedAt: d(1),
  },
  {
    id: "srv_views_increase",
    type: "services",
    name: "Views & Traffic Growth Optimization",
    category: "Marketing & SEO",
    email: "$450 - $1,300",
    phone: "5 - 10 business days",
    tags: ["Traffic Growth", "Analytics", "GA4", "Engagement", "Viral Loops"],
    notes: JSON.stringify({
      description: "Data-driven traffic acquisition strategy combining high-intent content optimization, viral mechanics, and analytics instrumentation.",
      budget: "$450 - $1,300",
      pricingType: "fixed",
      deliveryTime: "5 - 10 business days",
      whatICanDo: [
        "Privacy-friendly analytics instrumentation (Google Analytics 4, Plausible, PostHog)",
        "High-intent keyword content strategy to capture ready-to-buy search traffic",
        "Dynamic OpenGraph social cards that increase click-through rates on Twitter/LinkedIn",
        "Viral loop mechanics: Referral incentives, social share prompts, embeddable badges",
        "Bounce rate reduction and session duration maximization through fast page loads"
      ]
    }),
    createdAt: d(4),
    updatedAt: d(1),
  },
];
