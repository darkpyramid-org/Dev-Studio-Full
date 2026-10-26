# ♿ Accessibility Statement — Dev Studio

> **Last reviewed:** October 2026
> **Applies to:** [https://ms-dev-studio.vercel.app](https://ms-dev-studio.vercel.app) and the open-source codebase at [github.com/darkpyramid-org/Dev-Studio-Full](https://github.com/darkpyramid-org/Dev-Studio-Full)

---

## Our Commitment

Dev Studio is built for developers by developers. We believe every person — regardless of disability, assistive technology, or environment — deserves full access to the tools that help them grow. We are actively working toward conformance with the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA**.

This is a commitment and a living goal, not a one-time checkbox. We improve accessibility continuously with every release.

---

## Priorities

We focus accessibility effort in this order:

1. **Keyboard navigation** — Every feature must be reachable and operable without a mouse
2. **Screen reader compatibility** — Semantic HTML, ARIA landmarks, and live regions for dynamic content
3. **Visual clarity** — Sufficient color contrast (≥ 4.5:1 for body text, ≥ 3:1 for UI components), clear focus rings
4. **Cognitive accessibility** — Plain language, consistent layouts, error messages that explain how to recover
5. **Motion safety** — Animations respect `prefers-reduced-motion`

---

## Contributor Expectations

All UI contributions must meet the following before merging:

| Requirement | Check |
|-------------|-------|
| All interactive elements reachable by keyboard | Manual test with Tab / Shift+Tab / Enter / Escape |
| Focus ring visible on all focusable elements | Visual inspection in all supported browsers |
| Images and icons have `alt` text or `aria-label` | Code review |
| Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI | [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) |
| Dynamic updates announced via `aria-live` | Screen reader test (NVDA/VoiceOver) |
| No information conveyed by color alone | Visual inspection |
| Form inputs have associated `<label>` elements | Code review |
| Error messages are descriptive and linked to inputs | Manual test |

> [!TIP]
> Install the [axe DevTools browser extension](https://www.deque.com/axe/devtools/) and run it on any page you modify before opening a PR. Include a screenshot of the report in your PR description.

---

## Reporting Accessibility Issues

If you encounter a barrier — something that prevents you from using a feature — please tell us.

**How to report:**
- 🐛 Open an [Accessibility Issue](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new?template=accessibility.yml) on GitHub
- 📧 Email **m.ssaid356@gmail.com** with subject `[ACCESSIBILITY] Dev Studio`

**Please include (what you can — nothing is required):**
- The task you were trying to complete
- The URL or page where you encountered the barrier
- What you observed vs. what you expected
- Browser, operating system, and any assistive technology you use (e.g., screen reader name and version)
- Screenshots or recordings (optional — never required)

You do **not** need to disclose a disability to report an accessibility issue.

---

## Severity Levels

| Severity | Definition | Target Response |
|----------|-----------|-----------------|
| 🔴 **Critical** | A feature is completely unusable without workaround | Patch within 7 days |
| 🟠 **High** | A feature is difficult or partially inaccessible | Fix within 30 days |
| 🟡 **Medium** | A barrier exists but a workaround is available | Fix in next minor release |
| 🟢 **Low** | Visual polish or minor enhancement | Tracked for future sprint |

### How We Respond

1. **Acknowledgment** within 48 hours of receiving your report
2. **Severity triage** within 5 business days
3. **Status updates** at each milestone (investigation → fix → release)
4. **Workaround** provided if a fix is delayed beyond 7 days for critical issues
5. **Verification opportunity** — we'll invite you to confirm the fix works for you

---

## Supported Environments

We test against the following combinations:

| Browser | Version | Screen Reader | Platform |
|---------|---------|--------------|---------|
| Chrome | Latest | NVDA 2024+ | Windows 11 |
| Firefox | Latest | NVDA 2024+ | Windows 11 |
| Safari | Latest | VoiceOver | macOS Sonoma |
| Chrome | Latest | TalkBack | Android 14 |

**Input methods tested:** Keyboard only, mouse, touch, switch access

> [!NOTE]
> We have not yet conducted a formal independent audit. All conformance claims are aspirational targets backed by ongoing testing — not verified certification.

---

## Known Limitations

| Area | Limitation | Workaround | Tracked Issue |
|------|-----------|------------|---------------|
| Code editor panels | Syntax highlighting color contrasts may fall below 4.5:1 in some themes | Use the high-contrast system theme | [#tracked] |
| Toast notifications | Auto-dismiss toasts may disappear before screen readers announce them | Errors are also shown inline | [#tracked] |
| Data tables | Some tables lack column header `scope` attributes | Use browser's reading mode | [#tracked] |
| Rich text inputs | Markdown preview area not fully navigable by keyboard | Use raw text mode | [#tracked] |

We are actively working to resolve these. If a limitation blocks you completely, please [report it](#reporting-accessibility-issues) so we can prioritize.

---

## Ownership & Maintenance

| Role | Responsibility |
|------|---------------|
| **Maintainer** ([@Mostafa-SAID7](https://github.com/Mostafa-SAID7)) | Accessibility triage, PR reviews, quarterly statement review |
| **Contributors** | Validate accessibility of their own UI changes before submitting |

This statement is reviewed every **6 months** or after any major UI release. The review date is updated at the top of this document.

---

## Feedback on This Statement

If this accessibility statement is itself unclear, missing information, or hard to use, please [open an issue](https://github.com/darkpyramid-org/Dev-Studio-Full/issues/new) or email us. Improving how we communicate about accessibility is part of the commitment.

---

*This statement follows the [W3C Accessibility Statement Generator](https://www.w3.org/WAI/planning/statements/) guidance.*
