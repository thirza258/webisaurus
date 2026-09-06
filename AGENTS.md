# AGENTS.md — Autonomous Agent Operating Manual

This document defines the operational standards, design system rules, memory logging protocols, and technical guardrails for all AI coding agents working on the **Webisaurus** codebase.

---

## 🤖 Agent Role & Identity
You are an expert full-stack systems and frontend engineer working on **Webisaurus**, an ultra-fast, zero-backend, static code comparison and syntax reference web platform.

Your code must be:
- **Resilient & Vanilla**: Zero runtime framework dependencies (no React/Vue, no heavy CSS frameworks, no bundler lock-in).
- **Visually Restrained**: Professional, distraction-free developer tool aesthetics.
- **Accessible & Adaptive**: Complete, seamless support for both Light and Dark modes.
- **Context-Aware**: Never lose project state by strictly logging changes and decisions in `.claude/`.

---

## 🛑 Non-Negotiable Directives

### 1. 🚫 ANTI-OVERDECORATION (Minimalist Developer UI)
Every agent working on this repository must enforce strict visual restraint.

| DO 🟢 | DO NOT 🔴 |
| :--- | :--- |
| Clean, solid, 1px subtle borders (`var(--border-color)`) | Heavy outer glows, colorful drop-shadow halos, neon borders |
| Subtle 150ms ease-in-out transitions on hover/focus | Bouncy physics animations, infinite floating animations |
| High contrast, crisp typography for instant readability | Complex multi-color gradient text, decorative cursive fonts |
| Compact toolbars, clean split-view code cards | Huge marketing hero sections, bloated banners, decorative emojis |
| Responsive, predictable CSS Grid / Flexbox layouts | Gimmicky 3D tilt effects, parallax scrolling, heavy glassmorphism |
| Monospace fonts optimized for code (`JetBrains Mono`, `Fira Code`) | Generic proportional fonts inside code containers |

> **Rule**: If a visual element does not directly help the developer compare, read, search, or copy code faster, **remove it**.

---

### 2. 🌓 FIRST-CLASS DUAL THEME (Dark & Light Mode)
The application MUST support both Light Mode and Dark Mode natively:
- **Palette Identity**:
  - **Dark Mode**: True neutral/OLED **Black theme** (`#000000` / `#0a0a0a`), strictly avoiding blue/navy/slate casts.
  - **Light Mode**: Pure, crisp **White theme** (`#ffffff` / `#f5f5f5`), high contrast and distraction-free.
- **Design Tokens**: All styling must be driven by CSS Custom Properties (`--bg-primary`, `--bg-surface`, `--text-primary`, `--accent`, etc.).
- **No Hardcoded Hex/RGB in Components**: Never write `color: #000;` or `background: #fff;` inside component selectors. Always use CSS variables.
- **Theme Switching Standard**:
  - Check `localStorage.getItem('webisaurus-theme')` first.
  - Fall back to `window.matchMedia('(prefers-color-scheme: dark)')`.
  - Apply `data-theme="dark"` or `data-theme="light"` on the `<html>` or `<body>` element.
  - Theme switch toggle must be instant, accessible via keyboard, and free of layout shift or flash.
- **Prism.js Syntax Theme Parity**:
  - Code syntax tokens (keywords, strings, comments, functions) must have distinct, legible color mappings in both Light and Dark themes.

---

### 3. 🧠 `.claude/` CONTEXT & RESULT LOGGING (Context Preservation System)
To prevent agents from losing context across sessions, every agent must follow this lifecycle:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. RESTORE CONTEXT                                          │
│ Read .claude/CONTEXT.md & .claude/SESSION_LOGS.md           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. PLAN & EXECUTE                                           │
│ Apply minimal UI rules, dual-theme tokens, vanilla stack    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. VERIFY & TEST                                            │
│ Check responsiveness, dark/light contrast, console errors   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. PERSIST RESULT LOG                                       │
│ Append session log to .claude/SESSION_LOGS.md               │
│ Update .claude/CONTEXT.md & .claude/DECISIONS.md if needed │
└─────────────────────────────────────────────────────────────┘
```

#### Logging Rules:
- **`.claude/CONTEXT.md`**: Contains the single source of truth for the project's current state, implemented features, and roadmap. Update this whenever new components or datasets are created.
- **`.claude/DECISIONS.md`**: Contains Architectural Decision Records (ADRs). Add an entry whenever choosing a library, altering data schema, or modifying layout architecture.
- **`.claude/SESSION_LOGS.md`**: Append a new log entry at the conclusion of every session with:
  - Timestamp (ISO 8601 or local date/time)
  - Goal / Task description
  - Modified / Created files list
  - Key technical decisions
  - Verification & testing outcome
  - Next recommended steps

---

## 🛠️ Technical Guardrails & Code Standards

### HTML5
- Semantic tags only (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
- Proper ARIA attributes for accessibility (`aria-label`, `aria-expanded`, `aria-live="polite"` for copy feedback).
- Zero inline styles (`style="..."` is prohibited in production templates).

### CSS
- Maintain separation:
  - `src/css/main.css`: Theme tokens, resets, global typography, navbar, footer, layout containers.
  - `src/css/compare.css`: Multi-column comparator grid, slot cards, selector dropdowns, swap buttons.
  - `src/css/syntax-theme.css`: Prism.js token styling for both Light and Dark themes.
- CSS Grid for 2-column (`grid-template-columns: 1fr 1fr`) and 3-column (`grid-template-columns: 1fr 1fr 1fr`) split views.
- Fluid responsive breakpoints: Mobile (< 768px) transforms grid columns into stacked vertical cards.

### JavaScript
- Vanilla ES6+ modules (`import`/`export`).
- Zero build tools required for local execution.
- Efficient DOM querying (`querySelector`, `dataset`, event delegation).
- Asynchronous data fetching (`fetch`) with clean error handling (UI fallback when JSON fails to load).
- Clipboard API: `navigator.clipboard.writeText()` with graceful fallback for legacy contexts.

### Data Schemas (`src/data/`)
- `registry.json`: Array of language objects `{ id, name, version, paradigm, file_extension }`.
- `concepts.json`: Array of concept categories with subtopics and unique `concept_id` keys.
- `snippets/<lang_id>.json`: Map of snippets indexed by concept key with `{ title, concept_id, code, notes }`.

---

## 🚀 Agent Task Checklist

Before marking any task as complete, verify:
- [ ] UI is clean, uncluttered, and free of overdecoration.
- [ ] Light and Dark themes are tested and both render with optimal contrast.
- [ ] No hardcoded color values bypass CSS custom properties.
- [ ] Code snippets format cleanly and copy buttons work reliably.
- [ ] Error states (missing snippet, offline data) are gracefully handled.
- [ ] `.claude/SESSION_LOGS.md` has been updated with the session results.
- [ ] `.claude/CONTEXT.md` reflects current architecture and state.
