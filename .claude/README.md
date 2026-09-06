# .claude — AI Agent Context & Memory System

This directory acts as the persistent long-term memory for AI agents (Claude, Antigravity, Copilot, etc.) working on the **Webisaurus** project.

---

## 🎯 Purpose
To prevent context drift, memory loss across sessions, or accidental regressions in design/architectural rules, agents must read and update these files on every session.

---

## 📁 File Structure

| File | Purpose | Update Frequency |
| :--- | :--- | :--- |
| **`CONTEXT.md`** | Master snapshot of current architecture, implemented features, and roadmap state. | Updated when major components, routes, or datasets are added/modified. |
| **`DECISIONS.md`** | Architectural Decision Records (ADRs) capturing key design, technical, and structural choices. | Updated whenever a significant technical or architectural decision is made. |
| **`SESSION_LOGS.md`** | Chronological ledger of tasks, code changes, verification results, and pending actions. | **Mandatory update at the end of every session/task.** |

---

## 🔄 Protocol for Agents

1. **Session Start**:
   - Read `CONTEXT.md` and the most recent entry in `SESSION_LOGS.md`.
2. **Session Execution**:
   - Respect the Anti-Overdecoration Rule (clean, minimal developer UI).
   - Maintain Dual Theme (Dark and Light mode) support via CSS tokens.
   - Use Vanilla HTML5, CSS3, and ES6+ JS without unnecessary dependencies.
3. **Session End**:
   - Append a new entry to `SESSION_LOGS.md`.
   - Update `CONTEXT.md` / `DECISIONS.md` if the state or decisions changed.
