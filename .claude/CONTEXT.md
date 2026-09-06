# System Context & Architecture Snapshot — Webisaurus

**Last Updated**: 2026-09-06
**Status**: MVP Implementation Complete — All Core Features Implemented

---

## 📌 Project Overview
- **Project Name**: Webisaurus (polyglot-syntax)
- **Tagline**: Static Polyglot Syntax Reference & Multi-Language Code Comparator
- **Type**: 100% Client-side Static Web Application (Zero backend, zero build tool dependency)
- **Deployment**: Nginx Alpine (`nginx:alpine`) Docker container (< 25MB RAM footprint)

---

## 🎯 Core Features (All Implemented ✅)
1. **Multi-Language Code Comparator** (`compare.html` + `compare.js`):
   - ✅ Side-by-side comparison of 2 or 3 programming languages for a selected syntax concept
   - ✅ Concept selector dropdown with optgroup categories
   - ✅ Language selector slots with default Python / JavaScript
   - ✅ Add/Remove 3rd language slot (dynamic grid 2→3 columns)
   - ✅ Slot swapping between any two slots
   - ✅ Copy code per slot with ✓ feedback
   - ✅ Responsive: stacks to single column on mobile (< 768px)

2. **Single Language Syntax Explorer** (`index.html` + `app.js`):
   - ✅ Language sidebar with selectable items
   - ✅ Version and paradigm badges in content header
   - ✅ Concept cards grid with Prism.js syntax highlighting
   - ✅ Copy code buttons with "Copied!" feedback
   - ✅ Missing snippet placeholder
   - ✅ Auto-selects first language on load

3. **Fast Client-Side Search & Filter**:
   - ✅ Instant language name filtering in sidebar (#search-input)

4. **Dark & Light Theme**:
   - ✅ CSS Custom Property tokens for all colors
   - ✅ localStorage persistence (`webisaurus-theme`)
   - ✅ System prefers-color-scheme fallback
   - ✅ Prism.js syntax tokens styled for both themes

5. **High-Speed Caching & State Persistence**:
   - ✅ Two-tier data caching: in-memory Map + `localStorage` with Stale-While-Revalidate (SWR) for 0ms initial render
   - ✅ Automatic quota management with safe snippet cache eviction
   - ✅ Service Worker (`src/sw.js`) with Cache API for static assets and offline availability
   - ✅ State persistence across page refreshes: remembers selected language in Explorer, selected concept, slot languages, and 3rd slot status in Comparator

6. **PWA Standalone & Offline Installation**:
   - ✅ Web App Manifest (`src/manifest.json`) with crisp vector/PNG icons
   - ✅ Standalone window capability, installable on Chrome/Edge/macOS/mobile
   - ✅ 100% functional in air-gapped environments via Service Worker Cache API

7. **URL Deep-Linking & Shareable State (P1)**:
   - ✅ Explorer: `?lang=<lang_id>#<concept_id>` with smooth auto-scroll to concept
   - ✅ Comparator: `?concept=<concept_id>&slots=<lang1>,<lang2>,<lang3>`
   - ✅ URL state synchronizes via `history.replaceState` without page reloads
   - ✅ "🔗 Share" buttons on both pages for instant clipboard copy with visual feedback

8. **Seamless Cross-Navigation (P2)**:
   - ✅ Explorer to Comparator: `⇄ Compare` button on each concept card jumps directly into comparator with that concept preselected
   - ✅ Comparator to Explorer: `↗ Explore` link on each slot header jumps to that language's full 24-concept reference

9. **Command Palette (`Ctrl+K` / `Cmd+K` / `/`) (P3)**:
   - ✅ Global keyboard-accessible modal switcher (`src/js/command-palette.js`)
   - ✅ Instant fuzzy search across all 140 languages and 24 concepts
   - ✅ Arrow-key navigation, enter to select, escape/backdrop to dismiss
   - ✅ Quick actions (Explorer, Comparator, Theme toggle, Share link)

10. **Sidebar Paradigm Filter Badges (P4)**:
    - ✅ Category & paradigm filter chips (`Systems`, `Web`, `Enterprise`, `Functional`, `Data`, `Compiled`, `Dynamic`, `Static`)
    - ✅ Live filtered language counter and integrated text query search

11. **Direct Links to Official Playgrounds & REPLs (Feature 8)**:
    - ✅ Direct links in language header to official sandboxes (`src/js/playground.js`): Rust Playground, Go Playground, TypeScript Playground, Compiler Explorer, etc.


---

## 🎨 UI/UX & Design Directives (Enforced)
- **Anti-Overdecoration Policy**: Minimalist, utilitarian, high-contrast, distraction-free developer tool UI.
- **Theme Support**: First-class **True Black Dark Theme** (neutral OLED black, zero blue tint) and **Pure White Light Theme** with adaptive Prism.js syntax coloring and native `color-scheme` support.
- **Typography**: Monospace (`JetBrains Mono`, `Fira Code`, `Consolas`) for code, system sans-serif for UI.

---

## 🏗️ Technical Stack (Implemented)
- **Markup**: Semantic HTML5 (`src/index.html`, `src/compare.html`)
- **Styles**: Vanilla CSS (`src/css/main.css`, `src/css/compare.css`, `src/css/syntax-theme.css`)
- **Logic**: Vanilla ES6+ Modules (`src/js/app.js`, `src/js/compare.js`, `src/js/data-loader.js`, `src/js/theme.js`)
- **Caching & Offline**: Service Worker (`src/sw.js`) + `localStorage` SWR engine
- **Highlighter**: Prism.js 1.29.0 locally bundled (`src/js/vendor/prism.min.js`) with 58 components (92 grammars)
- **Server**: Nginx Alpine (`Dockerfile`, `nginx.conf`, `docker-compose.yml`)

---

## 📊 Data Model & Content (140 Languages / 3,360 Snippets)
- `src/data/registry.json`: 140 programming languages indexed across 9 categories (Systems, Web & Scripting, Enterprise, Functional, Data Science, Mobile, Database, HDL, Historical).
- `src/data/concepts.json`: 7 structured categories, 24 comprehensive syntax concepts (Fundamentals, Strings, Control Flow, Loops, Functions & OOP, Data Structures & Collections, Error Handling).
- `src/data/snippets/`: 140 language snippet JSON files × 24 concepts = 3,360 idiomatic snippets and technical explanations.
- `src/js/vendor/prism.min.js`: 58 Prism components bundled with UTF-8 encoding covering 92 syntax grammars + comprehensive alias resolution via `getPrismLanguage()`.

---

## 🗺️ Roadmap & Milestones
- [x] **Milestone 0**: Project instructions, guidelines, and context memory system
- [x] **Milestone 1**: Core HTML/CSS boilerplate, responsive comparator grid, theme toggle, JSON loader
- [x] **Milestone 2**: Prism.js integration, theme-adaptive syntax styling, slot swapping, copy-to-clipboard
- [x] **Milestone 3**: Seed dataset for 6 Tier 1 languages across 10 fundamental concepts
- [x] **Milestone 4**: Docker containerization (Dockerfile, nginx.conf, docker-compose.yml)
- [x] **Milestone 5**: Full PRD Language Coverage — all 140 languages across 9 domains implemented
- [x] **Milestone 6**: Expand concept taxonomy (24 core syntax concepts: variables, comments, numbers, data types, type casting, strings, string formatting, booleans, operators, conditionals, pattern matching, while/for loops, range, iterators, functions, OOP/classes, arrays, lists, tuples, sets, maps/dictionaries, modules/import, error handling)
- [ ] **Milestone 7**: Fuzzy search across concepts/snippets, paradigm/type filtering

