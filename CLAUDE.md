# CLAUDE.md — Webisaurus Project Guidelines & Context

Welcome to **Webisaurus** — a zero-backend, ultra-fast, static web platform for syntax reference and multi-language side-by-side code comparison.

---

## 🎯 Core Directives & Inviolable Principles

### 1. 🚫 Anti-Overdecoration Directive (Keep It Clean & Minimal)
- **Primary Focus**: Code readability, high information density, and rapid developer lookup.
- **Zero Visual Bloat**:
  - **NO** gratuitous animations, bouncing elements, confetti, or parallax effects.
  - **NO** heavy glassmorphism, muddy neon glows, or multi-stop radial gradients that reduce contrast.
  - **NO** decorative fluff, marketing-style hype banners, or unnecessary illustrations.
- **Design Philosophy**: Functional minimalism, crisp borders (`1px solid var(--border-color)`), deliberate whitespace, legible monospace fonts for code (`JetBrains Mono`, `Fira Code`, `Consolas`, monospace), and neutral sans-serif for UI (`Inter`, `system-ui`, -apple-system, sans-serif).
- **Utilitarian Developer UX**: Fast loading, instant keyboard navigation, clean split-view grids, prominent copy buttons, and clear syntax highlighting.

---

### 2. 🌓 Dual Theme Mandate (First-Class Dark & Light Modes)
- Both **Light** and **Dark** modes are required and must have equal design quality and contrast.
- **CSS Variable Design Tokens**:
  - All colors must use CSS Custom Properties declared in `:root` and overridden in `[data-theme="dark"]` (or `[data-theme="light"]`).
  - Never hardcode hex/rgb color values in component CSS. Always use semantic tokens:
    ```css
    :root {
      color-scheme: light;
      /* Pure White Light Theme */
      --bg-primary: #ffffff;
      --bg-surface: #ffffff;
      --bg-surface-elevated: #f5f5f5;
      --bg-code: #f8f8f9;
      --text-primary: #0a0a0a;
      --text-secondary: #525252;
      --text-muted: #737373;
      --text-code: #171717;
      --border-color: #e5e5e5;
      --border-focus: #0a0a0a;
      --accent: #0a0a0a;
      --accent-hover: #262626;
      --accent-subtle: #f0f0f0;
      --badge-bg: #f4f4f5;
      --badge-text: #18181b;
      --success: #16a34a;
      --warning: #ca8a04;
      --danger: #dc2626;
      --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      --font-code: "JetBrains Mono", "Fira Code", Consolas, Menlo, Monaco, monospace;
    }

    [data-theme="dark"] {
      color-scheme: dark;
      /* Pure Black Dark Theme (OLED Black, Zero Blue Tint) */
      --bg-primary: #000000;
      --bg-surface: #0a0a0a;
      --bg-surface-elevated: #171717;
      --bg-code: #050505;
      --text-primary: #ffffff;
      --text-secondary: #a3a3a3;
      --text-muted: #737373;
      --text-code: #f5f5f5;
      --border-color: #262626;
      --border-focus: #737373;
      --accent: #ffffff;
      --accent-hover: #e5e5e5;
      --accent-subtle: #1f1f1f;
      --badge-bg: #1c1c1c;
      --badge-text: #e5e5e5;
      --success: #22c55e;
      --warning: #eab308;
      --danger: #ef4444;
    }
    ```
- **Theme Switcher Behavior**:
  - Support automatic system preference detection (`window.matchMedia('(prefers-color-scheme: dark)')`).
  - Persist user preference explicitly via `localStorage.getItem('webisaurus-theme')`.
  - Provide a single, discreet toggle button in the top navigation bar with icon & label.
  - Prism.js / code block theme must adapt smoothly without unstyled flashes (FOUC).
- **Accessibility & Contrast**:
  - Comply with WCAG 2.1 AA contrast ratio (minimum 4.5:1 for body text, 3:1 for large text and UI components).

---

### 3. 🧠 Context & Result Logging in `.claude/` (Memory Preservation)
To ensure AI assistants never lose context across sessions, tasks, or restarts, strict logging protocols are enforced in the `.claude/` directory:

```
.claude/
├── README.md            # Explanation of the context preservation system
├── CONTEXT.md           # Master snapshot of current state, features, active stack
├── DECISIONS.md         # Architectural Decision Records (ADR)
└── SESSION_LOGS.md      # Chronological log of changes, results, and next steps
```

#### 📋 Mandatory AI Workflow Protocol:
1. **At the Start of Any Task (Context Restoration)**:
   - Read `.claude/CONTEXT.md` to understand the overall architecture and current progress.
   - Read the latest entries in `.claude/SESSION_LOGS.md` and `.claude/DECISIONS.md`.
2. **During the Task**:
   - Adhere strictly to the established architectural decisions and minimal UI rules.
3. **At the End of Any Task (Context Persistence)**:
   - Update `.claude/SESSION_LOGS.md` with a timestamped log entry containing:
     - **Goal / Prompt summary**
     - **Files Created / Modified**
     - **Key Decisions Made**
     - **Verification / Test Results**
     - **Pending Items / Next Steps**
   - If architecture or tech stack changes, update `.claude/CONTEXT.md`.
   - If a significant design/technical decision is made, append a record in `.claude/DECISIONS.md`.

---

## 🏗️ Project Architecture & Tech Stack

- **Architecture**: 100% Static Web Application (Zero backend, zero build-step requirement).
- **Frontend Stack**:
  - **HTML**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`, ARIA roles).
  - **CSS**: Modern Vanilla CSS (CSS Grid, Flexbox, Custom Properties). Zero Tailwind/Bootstrap runtime bundle.
  - **JavaScript**: ES6+ Modules (`import`/`export`), native Fetch API for static JSON, async/await.
  - **Syntax Highlighter**: Prism.js (locally bundled in `src/js/vendor/prism.min.js` and `src/css/syntax-theme.css`).
  - **Web Server**: Nginx Alpine (`nginx:alpine` via Docker).
- **Data Layer (Static JSON)**:
  - `src/data/registry.json`: Metadata for programming languages (id, name, version, paradigm, file_extension).
  - `src/data/concepts.json`: Hierarchical taxonomy of concepts and subtopics (Variables, Control Flow, Data Structures, OOP, Concurrency, etc.).
  - `src/data/snippets/<lang_id>.json`: Idiomatic code snippets per language mapped to `concept_id`.

---

## 📂 Standard File & Directory Structure

```plaintext
webisaurus/
├── .claude/                    # AI Memory & Context Persistence
│   ├── README.md
│   ├── CONTEXT.md
│   ├── DECISIONS.md
│   └── SESSION_LOGS.md
├── claude_docs/                # Project requirements & initial specifications
│   └── 1.md
├── src/                        # Static web application source
│   ├── index.html              # Home & Single Language Explorer
│   ├── compare.html            # Multi-Language Code Comparator
│   ├── css/
│   │   ├── main.css            # Base tokens, typography, layout, theme definitions
│   │   ├── compare.css         # Comparator grid, slot cards, toolbar styling
│   │   └── syntax-theme.css    # Light & Dark Prism.js syntax theme overrides
│   ├── js/
│   │   ├── app.js              # Explorer controller, search/filter, UI bindings
│   │   ├── compare.js          # Comparator controller, slot management, swap logic
│   │   ├── data-loader.js      # Fetching & caching static JSON datasets
│   │   ├── theme.js            # Light/Dark theme manager & persistence
│   │   └── vendor/
│   │       └── prism.min.js    # Local Prism syntax highlighter
│   └── data/
│       ├── registry.json       # Registered languages metadata
│       ├── concepts.json       # Concept hierarchy & topics
│       └── snippets/           # Language snippets
│           ├── python.json
│           ├── javascript.json
│           ├── go.json
│           ├── rust.json
│           ├── cpp.json
│           └── ...
├── Dockerfile                  # Production Nginx Alpine container
├── docker-compose.yml          # Container orchestration (port 8080:80)
├── nginx.conf                  # Nginx configuration (gzip, routing, caching)
├── CLAUDE.md                   # This instruction file
└── AGENTS.md                   # Multi-agent collaboration guide
```

---

## 🛠️ Development & Testing Guidelines

- **Running Locally (No Docker)**:
  - Serve `src/` using any static HTTP server (e.g., `python -m http.server 8000`, `npx serve src`, or Live Server).
- **Running via Docker**:
  ```bash
  docker compose up -d --build
  ```
  Access at `http://localhost:8080`.
- **Validation Checklist**:
  1. Both Light and Dark themes look legible, crisp, and high-contrast.
  2. Multi-language comparator correctly handles 2-column and 3-column splits.
  3. Mobile view transitions gracefully into stacked/accordion cards.
  4. Code copying works seamlessly with visual feedback (e.g. tooltip "Copied!").
  5. JSON datasets are properly validated and error states are handled gracefully.
  6. Results and context updates are logged to `.claude/`.
