# UI/UX context

## Approved direction

**Modern Packaging Workshop — Espresso & Kraft** is approved for future, explicitly authorized page-by-page implementation.

| Token | Value |
| --- | --- |
| Espresso | `#2B211B` |
| Warm Paper | `#F7F3ED` |
| Terracotta | `#A94F32` |
| Kraft | `#C7A882` |
| Cocoa | `#6B584D` |
| Porcelain | `#FFFDFC` |
| Border | `#DCCFC2` |
| Dark Umber | `#433026` |

Use Newsreader for editorial display headings and DM Sans for body/UI after an approved typography migration. The visual language should feel tactile, capable, premium, and rooted in making/printing packaging: restrained color, paper/board tactility, generous white space, precise tooling cues, and product-led imagery.

Avoid generic AI landing-page tropes, overuse of gradients, repetitive floating cards, ornamental motion, stock-looking visual noise, and reduced contrast.

## Current implementation assessment (confirmed)

- The active palette is legacy navy/yellow/gray (`headingTxtColor #1A3263`, `mainBgColor #FAB95B`, `#E8E2DB`) configured in `tailwind.config.js`; current fonts are Inter and Lora.
- Storefront uses a fixed translucent navbar and compact footer from the public route-group layout. Both are shared surfaces and should not be restyled as a side-effect of an individual page.
- Homepage has useful content hierarchy (hero, categories, trust brands, solutions, inspiration, FAQ, payment methods), but it is visually mixed: rounded cards, shadows, gradient footer, multiple blue/yellow/gray treatments, and dense promotional copy.
- Category and product experiences are functional but inconsistent: older detail UI and newer tiered/Amazon-style UI coexist. Category grids can display invented products when data is absent, which is unsuitable for a trustworthy premium commerce experience.
- The customizer is feature-rich but desktop-grid based (`MainAppContainer` with side tools/canvas/price panel) and relies on a dense SVG/3D interaction model. Its responsive affordances, pricing clarity, saving feedback, and accessibility need a dedicated, tested redesign—not cosmetic global changes.
- Admin is utilitarian Flowbite UI; it is out of scope for storefront page polish unless explicitly requested.
- Several text strings are visibly mojibake in source/UI (for example `â€”`, `Ã—`, `â€™`). This is a content-quality issue to schedule alongside the affected pages.

## Responsive and accessibility principles

- Start mobile-first and confirm 320px+, tablet, common laptop, and large-desktop behavior for every redesigned page.
- Preserve semantic landmarks/headings, keyboard access, visible focus, form labels/error states, native button/link behavior, and descriptive image alt text.
- Maintain readable contrast; Terracotta on warm paper requires testing before use for small text.
- Respect reduced motion; reserve animation for useful state/feedback, not decoration.
- Do not replace an interactive data/checkout/customizer control with a static showcase during redesign.

## Redesign principle

Improve one page (and its narrowly necessary local components) at a time. First create an approved visual plan, inventory every current action/state/API dependency, implement without changing contracts, then test desktop/mobile and core actions. Update the context files after the work.
