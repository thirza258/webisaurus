# Architectural Decision Records (ADR) — Webisaurus

This file records all significant technical, design, and structural decisions made for the **Webisaurus** project.

---

## ADR-001: Zero-Framework Static Architecture
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: The application serves as a developer syntax reference and comparator. High loading speed, zero maintenance overhead, and offline/air-gapped capability are top priorities.
- **Decision**: Use pure Vanilla HTML5, modern CSS with Custom Properties, and ES6+ JavaScript modules. No build steps (Vite/Webpack), no external UI frameworks (React/Vue), and no CSS utility bundles (Tailwind runtime).
- **Consequences**:
  - Instant page loads with near-zero bundle size.
  - Can run directly from a static file server or lightweight Nginx Alpine container.
  - Requires clean modular organization of vanilla JS and CSS files.

---

## ADR-002: Anti-Overdecoration & Developer-First Minimalist UI
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: Developer tools must minimize cognitive fatigue and maximize code scanning efficiency. Excessive animations, heavy gradients, and decorative bloat distract from comparing code.
- **Decision**: Enforce a strict anti-overdecoration guideline across all files. Use crisp 1px borders, generous whitespace, clear monospace typography for code, and subtle, functional hover/focus states only.
- **Consequences**:
  - Clean, professional, high-density interface.
  - Easy to maintain and style across both light and dark themes.

---

## ADR-003: Native Dual-Theme Architecture with CSS Custom Properties
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: Developers work in varied lighting environments and have strong preferences for either dark or light code editors.
- **Decision**: Implement first-class Dark and Light modes using CSS variables defined in `:root` and `[data-theme="dark"]`. The active theme is persisted in `localStorage` with a fallback to `prefers-color-scheme`. Both UI elements and Prism.js syntax highlighting must adapt seamlessly without page flicker.
- **Consequences**:
  - Instant theme switching with zero page reload.
  - Full WCAG AA contrast compliance in both modes.

---

## ADR-004: Persistent Context & Session Logging via `.claude/`
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: Multiple AI agents and LLM sessions may interact with the codebase over time. Without structured persistence, agents risk losing context on previous decisions, roadmap status, or design standards.
- **Decision**: Standardize `.claude/` directory with `CONTEXT.md`, `DECISIONS.md`, and `SESSION_LOGS.md`. Mandate that any AI agent reads these files at session start and writes results at session end.
- **Consequences**:
  - Seamless continuity across different AI prompts and agent instances.
  - Transparent history of architectural and implementation progress.

---

## ADR-005: Palette Migration to True Black (OLED) and Pure White Theme
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: The previous dark theme used navy/slate/blue-tinted backgrounds (`#0b0f19`, `#111827`, `#1e293b`), which developers found distracting compared to true pitch black environments. The light theme needed to strictly adhere to a clean, pure white aesthetic (`#ffffff`, `#f5f5f5`).
- **Decision**:
  - Migrate dark theme to neutral OLED black: `--bg-primary: #000000`, `--bg-surface: #0a0a0a`, `--bg-surface-elevated: #171717`, `--bg-code: #050505`, with neutral gray borders (`#262626`) and crisp white text (`#ffffff`), eliminating all blue/navy tints.
  - Align light theme to pure white: `--bg-primary: #ffffff`, `--bg-surface: #ffffff`, `--bg-surface-elevated: #f5f5f5`, `--bg-code: #f8f8f9`, with clean neutral borders (`#e5e5e5`) and sharp near-black text (`#0a0a0a`).
  - Add native `color-scheme: light` and `color-scheme: dark` to ensure system scrollbars, form controls, and selection highlights match the respective palette.
  - Refined Prism.js syntax highlighting tokens to achieve optimal contrast against both pure white and pure black backgrounds.
- **Consequences**:
  - Ultra-high contrast and distraction-free developer experience.
  - Zero eye-strain in pitch black and bright environments.

---

## ADR-006: High-Speed Caching and State Persistence Architecture
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: In a zero-backend architecture indexing 140 languages with 1,400 snippets, network round-trips on page refresh or navigation add perceived latency. Furthermore, developers navigating away or refreshing the page lost their currently selected language, concept, and comparator slots.
- **Decision**:
  - Implement a two-tier data caching strategy: in-memory `Map` (instant within session) and `localStorage` (instant across refreshes) with Stale-While-Revalidate (SWR) background refresh.
  - Implement a Service Worker (`sw.js`) that pre-caches the static application shell and dynamically caches snippet requests using Cache Storage.
  - Add state persistence using `localStorage`:
    - `webisaurus_last_selected_lang`: Automatically re-selects and scrolls to the last viewed language in Explorer on refresh.
    - `webisaurus_compare_concept`: Restores active concept selection in Comparator.
    - `webisaurus_compare_slot_1|2|3` & `webisaurus_compare_slot3_active`: Restores slot languages and 3rd slot visibility in Comparator.
  - Preload high-traffic snippets (Python, JavaScript, TypeScript, Go, Rust, C++, Java, C) in the background.
  - Added nginx rule (`location = /sw.js`) to disable aggressive caching on the Service Worker script itself.
- **Consequences**:
  - 0ms perceived load time on page refresh and tab switching.
  - Fully functional offline application.
  - Seamless developer experience with zero context loss when refreshing.

---

## ADR-007: Comprehensive Syntax Concept Expansion to 24 Core Concepts
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: The initial MVP supported 10 fundamental syntax concepts per language. To serve as an exhaustive reference for polyglot software engineering across 140 programming languages, developers required comprehensive coverage of variables, data types, numbers, casting, comments, string manipulation, formatting, booleans, operators, branching/conditionals, pattern matching, loops (while/for), ranges, iterators/generators, functions, OOP/classes, data structures (arrays, lists, tuples, sets, maps/dictionaries), module imports, and error handling.
- **Decision**:
  - Expanded `src/data/concepts.json` from 10 to 24 standardized concept IDs organized across 7 distinct domain categories:
    1. Fundamentals (`variables`, `comments`, `data_types`, `numbers`, `booleans`, `type_casting`, `operators`)
    2. Strings & Text (`strings`, `string_formatting`)
    3. Control Flow & Branching (`conditionals`, `pattern_matching`)
    4. Loops & Iteration (`for_loop`, `while_loop`, `range`, `iterators`)
    5. Functions & OOP (`functions`, `oop_classes`)
    6. Data Structures & Collections (`arrays`, `lists`, `tuples`, `sets`, `maps`)
    7. Modularization & Safety (`modules_import`, `error_handling`)
  - Updated all 140 language snippet files in `src/data/snippets/*.json` to include authentic, non-placeholder, idiomatic code and technical notes for every one of the 24 concepts (3,360 snippets total).
  - Enhanced Explorer UI (`src/js/app.js` and `src/css/main.css`) with clean, full-width section headers (`.concept-category-header`) to organize the 24 cards cleanly without visual clutter.
  - Bumped Service Worker static cache version to `webisaurus-static-v2` and `localStorage` storage prefix to `webisaurus_cache_v2_` to ensure zero stale cache friction across all clients.
- **Consequences**:
  - Comprehensive reference capability with 3,360 total verified snippets across 140 languages.
  - Zero placeholder text; all code examples are syntactically accurate to the language paradigm.
  - Clear categorical organization improves scanning speed in accordance with Anti-Overdecoration guidelines.

---

## ADR-008: PWA Standalone Support, URL Deep-Linking, Command Palette, and Developer Ergonomics
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: While Webisaurus possessed deep syntax data across 140 languages, navigation required mouse clicks, comparison URLs could not be shared with teammates, the app could not be installed as a standalone desktop utility, and developers could not test code directly in online playgrounds.
- **Decision**:
  - **PWA Implementation**: Added `src/manifest.json` with vector SVG and 192/512 PNG icons, enabling desktop/mobile installation. Bumped Service Worker cache to `webisaurus-static-v3` caching all core application assets for complete offline functionality.
  - **URL Deep-Linking (P1)**: Used `URLSearchParams` and `history.replaceState` for non-reloading state synchronization: `?lang=...#concept_id` in Explorer and `?concept=...&slots=...` in Comparator. Added "🔗 Share" buttons for instant link copying with feedback.
  - **Seamless Cross-Navigation (P2)**: Added `⇄ Compare` action buttons on each concept card in Explorer that pre-populate the Comparator with that concept and language, and `↗ Explore` links on Comparator slot headers that open the full 24-concept reference.
  - **Command Palette (P3)**: Built `src/js/command-palette.js` accessible via `Ctrl+K`, `Cmd+K`, `/`, or navbar trigger button. Provides instant fuzzy search over 140 languages, 24 concepts, and navigation actions with full keyboard arrow/enter/escape support.
  - **Sidebar Filter Chips (P4)**: Added category and paradigm filter badges (`Systems`, `Web`, `Enterprise`, `Functional`, `Data`, `Compiled`, `Dynamic`, `Static`) with live count and text search integration.
  - **Official Playgrounds / REPLs (Feature 8)**: Built `src/js/playground.js` linking languages directly to official online sandboxes (Rust Playground, Go Playground, TypeScript Playground, Compiler Explorer, etc.) directly in the language header.
- **Consequences**:
  - Dramatically accelerated developer workflows with keyboard-driven navigation.
  - Seamless sharing of exact comparison scenarios between team members.
  - Installable as a 100% offline desktop application with zero background servers.




