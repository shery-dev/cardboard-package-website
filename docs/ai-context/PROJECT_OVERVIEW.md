# Project overview

## Purpose

CardboardPackage is a packaging e-commerce and operations application for custom boxes, catalogue products, paper rolls/reels, quotes, orders, and a lightweight admin area. The public site targets Pakistan and the USA in its metadata and copy. Customers can browse packaging categories, configure/select products, add items to a browser-persisted cart, place an unpaid order, or initiate Stripe Checkout.

## Confirmed stack

| Area | Implementation |
| --- | --- |
| Framework | Next.js 14.1.4, React 18, App Router, JavaScript/JSX |
| UI | Tailwind CSS 3.3, Flowbite/Flowbite React, React Icons |
| Fonts today | `Inter` and `Lora` loaded through `next/font/google` in both route-group layouts |
| State | one client React context, `context/Context.jsx`; cart mirrors to localStorage |
| Data | SQLite through `better-sqlite3`, `lib/db.js`; WAL enabled |
| Auth | custom bcryptjs credential check and signed JWT in `session` HTTP-only cookie |
| Payment | Stripe Checkout server route plus a separate pay-later order path |
| 3D | Three.js, React Three Fiber, Drei, React Spring; GLB models and texture assets |
| Uploads | Next route handlers write files directly to `public/uploads/` |
| Deploy | Docker on `node:20-slim`, app port 3000 mapped to 3001 by Compose |

`mongoose`, `next-auth`, and several Mongoose schemas remain installed/checked in but are not imported by active app/API code. The root README has not caught up with the SQLite migration.

## Main customer workflows

- **Browse:** home → category (`/cardboard/products-list/[id]`) → product (`/product-display/[id]`). Categories and products are supplied by SQLite APIs.
- **Standard/custom product purchase:** product detail calculates a material-based price; newer tiered products use `ProductPageAmazon` pricing. Both append to the shared cart.
- **Box customization:** `/customTool`, `/customTool/pizzaBox`, and `/customTool/shippingBox` load client-only 3D scenes. Customer chooses size/material/quantity, colors/artwork, then saves a design or adds its calculated line item to cart.
- **Cart/order:** cart supports guest pay-later data capture or sends line items to Stripe. Orders are persisted in SQLite by `/api/v1/create-order`.
- **Quote:** `/quotes` presents category/product selectors and fields, but inspection found no submit handler or persisted/emailed quote workflow.
- **Admin:** `/admin` is protected at layout level and provides catalog, orders, rates, stock/inventory, and saved-design screens. Its route handlers are not consistently authorization-protected.

## Live-reference comparison

The live homepage was crawled on 2026-10-15. It exposes the shared categories/quote/FAQ/product-inspiration/payment content and uses category URLs such as `/cardboard/products-list/ration-packaging-boxes`. The local code currently uses numeric database identifiers and differs in hero text/markup (local hero begins “Custom cardboard packaging that protects, impresses & delivers”; crawled live page begins “Wide range of cardboard packaging & custom boxes”). Treat these as a verified deployment/code divergence to investigate before a release; do not blindly copy live markup.

## Known functional gaps (confirmed)

- Quote form has no `onSubmit` implementation.
- Public category grids synthesize dummy product cards when an API category is empty (`CategoryProductGrid.jsx`).
- Stripe Checkout uses `http://localhost:3000/success` and `/cancel`, not the deployment origin.
- Stripe completion has no webhook; `success/page.jsx` relies on in-memory/local cart and a client-side request, so payment/order reconciliation is unreliable.
- The app has legacy pages/components that point to nonexistent `log-in` and `sign-in` APIs, although `/user-auth` and `/register` now redirect to `/admin-login`.
