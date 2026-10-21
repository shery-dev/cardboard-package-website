# Persistent project memory

## Confirmed durable facts

- As of 2026-10-15, active application data is SQLite (`data/cardboard.db`) via `lib/db.js`; old Mongoose models and parts of root README are stale.
- Public and admin shells are separate Next route-group root layouts. The public layout owns navbar/footer/context; the dashboard layout owns an admin JWT gate/sidebar.
- Cart is browser-local state (`itemsList` in localStorage) and its prices are calculated client-side using three different product/customizer paths.
- The 3D system has 17 dedicated GLTF product models covering every packaging category (Mailer, Pizza, Shipping, Kraft Paper Bag, Triangular Pizza Slice, Bakery Cake Box, Tool Box with handle, Two-Piece Gift Box, E-commerce with tear strip, Laptop with suspension tray, Flat Folder wrap, Food Combo clamshell, Food Platter with window, Apparel telescoping box, Ration Box with hand-holes, 1:1:1 Cube, and Corporate magnetic box), with matching FEFCO/ECMA vector cutting die molds.
- Customer login/register were removed in favor of admin-only authentication; residual sign-in/register components are legacy/dead paths.
- Local static and uploaded image paths are handled differently. Do not normalize persisted image values without accounting for `/api/v1/fetchImg` and `/uploads` adapters.
- The requested design system is Modern Packaging Workshop — Espresso & Kraft, with Newsreader + DM Sans. It is a future direction; current code uses Inter/Lora and legacy color tokens.
- Native modules (`better-sqlite3`, `sharp`, `bcrypt`) target Node 20 LTS (as specified in Dockerfile). Host Node 24 fails native compilation without Visual Studio 2019/2022 C++ build tools; isolated Node 20 runtime is housed in `.runtime/node20`.
- The 3D customizer supports all 17 box presets, each mapped to its own authentic 3D geometry and FEFCO die mold with real-time switching, dynamic standard sizes (`lib/boxPresets.js`), 17 FEFCO/ECMA die mold specifications (`lib/dieMoldSpecs.js`), unified CAD dieline geometry for both the 2D Design Net and Blueprint views (`lib/dieMoldGeometry.jsx`), and category-specific featured brand emblems (`lib/featureBoxTexture.js`).
- The 2D Design Net directly renders the authentic CAD Die Mold Blueprint for all 17 presets, supporting individual panel coloring, interactive image/logo upload/drag/scale/rotation, and high-resolution automated texture projection directly onto the 3D folded box preview.


## High-priority risks

- API mutation authorization is inconsistent and mostly absent; dashboard layout protection does not secure the underlying endpoints.
- Stripe checkout and order creation are not production-safe: localhost callback, client-trusted price, no webhook, client-state-dependent order confirmation.
- Compose persists uploads but not SQLite data; verify operational volume/backup plan before deployment work.
- `public/uploads/` appears both as project asset/data storage and uploaded runtime storage. Never bulk-delete it.
- Quote request is UI-only; do not represent it as a working lead pipeline.
- Category grid dummy fallback invents products; it risks customer trust and hides catalogue/data issues.
- Root README, legacy Mongo scripts/models, and installed dependencies can mislead an agent. Verify imports and callers.

## Owner preferences and process

- Redesign one page at a time with explicit approval before implementation.
- Preserve live business functionality while evolving visual design.
- Use existing assets whenever useful; aim premium and distinctive, never copy another packaging site.
- Keep documentation accurate and concise. Log meaningful work in `TASKS.md`, `MEMORY.md`, and `SESSION_HANDOFF.md`.
