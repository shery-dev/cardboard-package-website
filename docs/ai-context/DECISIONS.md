# Decisions

## 2026-10-15 — Establish a source-verified project knowledge base

**Decision:** Create `AGENTS.md` and the `docs/ai-context/` set before any redesign implementation.

**Why:** The project has no reliable prior AI context and contains contradictory legacy documentation (MongoDB vs active SQLite) plus high-risk business flows. Future work needs a durable, source-verified handoff.

## 2026-10-15 — Use Modern Packaging Workshop — Espresso & Kraft as the visual target

**Decision:** Future approved redesigns will follow the supplied espresso/kraft palette and Newsreader/DM Sans typography direction.

**Why:** This has explicit owner approval and better supports a premium, tactile custom-packaging brand than the current legacy navy/yellow palette.

**Constraint:** This records design direction, not permission to modify shared global tokens, fonts, or UI. Those changes need an approved page/shell task.

## 2026-10-15 — Redesign incrementally, preserving functional contracts

**Decision:** Work page-by-page with explicit approval before implementation; preserve existing APIs, cart line-item shape, customizer state/asset conventions, and database integration unless a separate task authorizes changes.

**Why:** Storefront visuals are intertwined with client-side pricing, custom 3D texture generation, SQLite data adapters, and incomplete commerce workflows.

## 2026-10-15 — Treat live site as reference, local source as implementation authority

**Decision:** Use cardboardpackage.com for customer-experience comparison, but verify every difference against the local repository before changing code.

**Why:** Crawled live homepage content/routes differ from local code, so neither can safely be assumed to represent the other.

## 2026-10-21 — Use isolated Node 20 LTS runtime for local deployment

**Decision:** Maintain an isolated portable Node 20 LTS directory (`.runtime/node20`) for local Windows execution without modifying host global Node 24. Seed initial catalogue into `data/cardboard.db`.

**Why:** Prebuilt binaries for `better-sqlite3` and `sharp` are certified on Node 20 LTS. System-wide Node 24 lacks C++ build tool compatibility for compiling from source. Initial database seeding was approved to ensure full storefront and admin functionality.

## 2026-10-21 — Multi-box preset architecture and tailored featured brand badges

**Decision:** Enable dynamic selection across all 17 box types in `/customTool` using a central preset catalog (`lib/boxPresets.js`), mapping to the three GLTF geometries (`MailerBox`, `PizzaBox`, `ShippingBox`), coupled with tailored featured brands (Pakistani and global) rendered via canvas badges in `lib/featureBoxTexture.js`.

**Why:** Allows customers and admins to customize any box type with authentic dimensions, materials, SVG dieline, 3D preview, and brand showcases directly in the unified customizer.



