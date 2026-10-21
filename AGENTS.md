# CardboardPackage agent guide

## First read

Before changing this repository, read `docs/ai-context/README.md`, `MEMORY.md`, `TASKS.md`, `DECISIONS.md`, and `SESSION_HANDOFF.md`, then inspect the relevant source. Documentation records verified context; it does not replace checking code.

## Scope and safety

- Preserve storefront, admin, SQLite, upload, cart, checkout, and 3D-customizer behavior unless the task explicitly authorizes a functional change.
- Work only on the requested page/component/task. Page redesigns require explicit approval before implementation.
- Do not expose or document credentials, JWT/Stripe values, customer records, or uploaded private data.
- Do not install packages, reseed, delete data, reset the database, or rewrite assets without explicit authorization.
- Treat `data/cardboard.db` and `public/uploads/` as production-like persistent data. SQLite writes require care because the database uses WAL mode.
- Do not rely on the legacy Mongoose models, old auth components, or README claims without verifying their active callers.

## Code conventions

- This is Next.js 14 App Router with JavaScript/JSX, Tailwind CSS, Flowbite, and `@/` import aliases.
- Keep server-only code out of client components. Browser-only Three.js code is dynamically imported with SSR disabled.
- Use `next/image` and existing image-resolution conventions: persisted upload filename -> `/api/v1/fetchImg/<filename>`; static assets use a leading `/` path.
- Preserve API response shapes (`{ data }`, current field spelling such as `materail`) until all consumers are deliberately migrated.
- Maintain the customer-facing cart item schema in `context/Context.jsx`; cart data is persisted in localStorage.
- Reuse existing assets where possible. Do not use placeholder inventory or fabricated catalog data as a design solution.

## Design system direction

The approved direction is **Modern Packaging Workshop — Espresso & Kraft**:

- Espresso `#2B211B`, Warm Paper `#F7F3ED`, Terracotta `#A94F32`, Kraft `#C7A882`, Cocoa `#6B584D`, Porcelain `#FFFDFC`, Border `#DCCFC2`, Dark Umber `#433026`.
- Newsreader for editorial headings; DM Sans for body/UI.
- Aim for premium, tactile packaging-workshop character. Avoid generic layouts, gratuitous gradients, repeated cards, and decorative animation.

Do not change global tokens, font loading, or shared shell/navigation as incidental page work. Propose those changes in the relevant page task first.

## Documentation workflow (mandatory)

After meaningful work, update only the relevant context files:

1. `TASKS.md` for task status and page progress.
2. `MEMORY.md` for durable constraints/findings.
3. `DECISIONS.md` for a new approved technical/design decision.
4. `ARCHITECTURE.md`, `PROJECT_STRUCTURE.md`, or `UIUX.md` if implementation changes them.
5. `SESSION_HANDOFF.md` with actual files changed, verification, open risks, and next action.

Keep entries dated, concise, factual, and distinguish confirmed facts from proposals. Never mark a task complete without verification appropriate to its risk.
