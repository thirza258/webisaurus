# 🦕 Webisaurus

**Polyglot Syntax Reference & Multi-Language Code Comparator**

A zero-backend, ultra-fast static web platform for browsing programming language syntax and comparing implementations side-by-side. No frameworks, no build step — just HTML, CSS, and vanilla JavaScript served from a lightweight Nginx container.

---

## ✨ Features

- **Syntax Explorer** — Browse 140 programming languages across 24 core syntax concepts (3,360 snippets total), complete with syntax-highlighted code and copy-to-clipboard
- **Code Comparator** — Compare 2 or 3 languages side-by-side for any concept with dynamic slot swapping
- **PWA Standalone & Offline Ready** — Progressive Web App with `manifest.json` and Service Worker (`Cache API` + Stale-While-Revalidate) for 100% air-gapped desktop installation
- **Command Palette (`Ctrl+K` / `Cmd+K` / `/`)** — Keyboard-first modal switcher to search 140 languages, 24 concepts, or quick actions instantly
- **URL Deep-Linking & Shareable State** — Share direct links to exact language views and comparisons (`?lang=rust#error_handling`, `?concept=pattern_matching&slots=rust,go,python`) with one-click "🔗 Share" copy
- **Seamless Cross-Navigation** — Jump from any concept in Explorer directly into Comparator (`⇄ Compare`), and jump from any comparison slot directly into the full language reference (`↗ Explore`)
- **Sidebar Paradigm Filter Badges** — Filter languages instantly by category or paradigm (`Systems`, `Web`, `Enterprise`, `Functional`, `Data`, `Compiled`, `Dynamic`, `Static`)
- **Direct Online Playgrounds & REPLs** — Direct links to official sandboxes (Rust Playground, Go Playground, TypeScript Playground, Compiler Explorer, etc.)
- **Instant Caching & State Persistence** — Two-tier caching (`localStorage` + Service Worker). Remembers selected language, comparator slots, and active concepts across page refreshes
- **True Black & Pure White Themes** — Instant toggle between OLED pitch-black and pure white themes with adaptive Prism.js syntax coloring
- **Docker Ready** — One command to deploy via Nginx Alpine (< 25 MB RAM footprint)
- **Mobile Responsive** — Compact layouts with sticky scrollable sidebar and stacked comparator columns on small screens

---

## 🚀 Quick Start

### Local Development (No Docker)

Serve the `src/` directory with any static HTTP server:

```bash
# Using npx
npx serve src

# Using Python
python -m http.server 8000 --directory src

# Using PHP
php -S localhost:8000 -t src
```

Open **http://localhost:8000** in your browser.

### Docker

```bash
docker compose up -d --build
```

Open **http://localhost:8080**.

---

## 📂 Project Structure

```
webisaurus/
├── src/                        # Static web application
│   ├── index.html              # Syntax Explorer page
│   ├── compare.html            # Code Comparator page
│   ├── css/
│   │   ├── main.css            # Design tokens, layout, components
│   │   ├── compare.css         # Comparator grid & slot cards
│   │   └── syntax-theme.css    # Prism.js token colors (light + dark)
│   ├── js/
│   │   ├── app.js              # Explorer page controller
│   │   ├── compare.js          # Comparator page controller
│   │   ├── data-loader.js      # Async JSON fetcher with caching
│   │   ├── theme.js            # Dark/light theme manager
│   │   └── vendor/
│   │       └── prism.min.js    # Prism.js 1.29.0 (bundled)
│   └── data/
│       ├── registry.json       # Language metadata
│       ├── concepts.json       # Concept taxonomy
│       └── snippets/           # Code snippets per language
│           ├── python.json
│           ├── javascript.json
│           ├── go.json
│           ├── rust.json
│           ├── cpp.json
│           └── java.json
├── .claude/                    # AI context preservation
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```

---

## 🗃️ Supported Languages (140 Languages across 9 Domains)

Webisaurus indexes **140 programming languages**, each with idiomatic snippets for all **24 core syntax concepts** (**3,360 code snippets total**):

| Category | Count | Languages Included |
|:---------|:-----:|:-------------------|
| **Systems, Infrastructure & Low-Level** | 25 | C, C++, Rust, Zig, Go, D, Nim, Odin, V (Vlang), Carbon, Hare, Mojo, Pony, Chapel, Ada, SPARK, Modula-2, Modula-3, Oberon, Assembly (x86-64), Forth, PostScript, BLISS, BCPL, B |
| **Web, Scripting & Dynamic** | 27 | Python, JavaScript, TypeScript, PHP, Ruby, Perl, Lua, Bash, Zsh, Fish, PowerShell, sh, KornShell (ksh), C Shell (csh), tcsh, Tcl, AWK, Sed, Expect, Rexx, AppleScript, AutoHotkey, ActionScript, Hack, CoffeeScript, LiveScript, MoonScript |
| **Enterprise, JVM & .NET** | 16 | Java, Kotlin, Scala, Groovy, Clojure, C#, F#, Visual Basic .NET, C++/CLI, Delphi, Free Pascal, Object Pascal, Xtend, Ceylon, Fantom, Golo |
| **Functional & Declarative** | 21 | Haskell, OCaml, Standard ML (SML), ReasonML, Erlang, Elixir, Gleam, Common Lisp, Scheme, Racket, Emacs Lisp (Elisp), Fennel, Hy, Elm, PureScript, ReScript, Idris, Agda, Coq, Lean, Pure |
| **Data Science & Numerical** | 14 | R, Julia, MATLAB, GNU Octave, SAS, Wolfram Language, Maple, Fortran, APL, J, K, Q, BQN, SAC |
| **Mobile & Multi-Platform** | 4 | Swift, Objective-C, Objective-C++, Dart |
| **Database, Query & Logic** | 12 | SQL, PL/SQL, T-SQL, PL/pgSQL, Prolog, Mercury, Datalog, Logtalk, SPARQL, Cypher, Gremlin, GraphQL |
| **Hardware Description (HDL)** | 7 | Verilog, SystemVerilog, VHDL, Chisel, SpinalHDL, Bluespec, MyHDL |
| **Historical & Computing Foundations** | 14 | COBOL, BASIC, ALGOL, Simula, Smalltalk, PL/I, SNOBOL, MUMPS, RPG, AutoCoder, IPL, COMTRAN, FLOW-MATIC, Short Code |

## 📚 Covered Concepts (24 Syntax Concepts)

| Category | Concepts |
|:---------|:---------|
| **Syntax & Fundamentals** | Variables & Constants, Comments & Documentation, Data Types, Numbers & Numerics, Booleans & Truthiness, Type Casting & Conversion, Operators |
| **Strings & Text** | Strings & Characters, String Formatting & Interpolation |
| **Control Flow & Branching** | If / Else Conditionals, Pattern Matching & Match |
| **Loops & Iteration** | For Loop, While Loop, Ranges & Slicing, Iterators & Generators |
| **Functions & OOP** | Functions & Closures, Classes & OOP, Modules & Imports |
| **Data Structures & Collections** | Arrays, Lists & Dynamic Arrays, Tuples & Records, Sets & Unique Collections, Dictionaries & Maps |
| **Error Handling** | Try / Except / Catch & Error Handling |


---

## 🎨 Theming

Webisaurus supports **Dark** and **Light** modes out of the box.

- Toggle via the 🌙/☀️ button in the navbar
- Automatically detects your OS preference (`prefers-color-scheme`)
- Persists your choice in `localStorage`
- All colors use CSS Custom Properties — zero hardcoded values

---

## 🤝 Contributing

### Adding a New Language

1. Add an entry to `src/data/registry.json`
2. Create `src/data/snippets/<lang_id>.json` following the schema:

```json
{
  "language_id": "kotlin",
  "snippets": {
    "variables": {
      "title": "Variables & Constants",
      "concept_id": "variables",
      "code": "val name = \"Alice\"\nvar age = 25\nconst val PI = 3.14",
      "notes": "Kotlin uses 'val' for immutable and 'var' for mutable variables."
    }
  }
}
```

3. Add the Prism.js language component to `src/js/vendor/prism.min.js` if syntax highlighting is needed

### Adding a New Concept

1. Add the concept to the appropriate category in `src/data/concepts.json`
2. Add a matching snippet entry (using the same `concept_id`) to each language's snippet file

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS (Grid, Flexbox, Custom Properties) |
| Logic | Vanilla ES6+ Modules |
| Syntax Highlighting | Prism.js 1.29.0 |
| Web Server | Nginx Alpine |
| Container | Docker |

**Zero frameworks. Zero build tools. Zero runtime dependencies.**

---

## 📄 License

MIT
