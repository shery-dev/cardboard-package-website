# Architecture

## Rendering and routing

There is no single `app/layout.jsx`; Next route groups supply two root layouts:

- `app/(home)/layout.jsx`: global CSS, Inter/Lora variables, `AppContextProvider`, fixed navbar, footer, public metadata.
- `app/(dashboard)/layout.jsx`: global CSS, server-side `CheckUser()` gate, admin sidebar. A non-admin redirects to `/admin-login`.

Most data-driven storefront pages are client components that fetch the application’s own APIs after hydration. This means catalog content is not generally server-rendered and API availability affects initial UI.

## State and cart

`context/Context.jsx` holds public app state. It persists `itemsList` to `localStorage`, recomputes `totalPrice`, and also owns all customizer state: active tool, material, quantity, dimension, selected panel, colors, generated texture/blob URL, and artwork transform maps. No external state library is used.

Cart line items are client-generated, not repriced server-side. Standard product and customizer price logic differ:

- `CardboardPage/ProductDP.jsx` uses materials database rates and a fixed local formula.
- `CardboardPage/ProductPageAmazon.jsx` selects `price_tiers` or product `rate`.
- `Manipulator/ProductForm.jsx` uses `(L × W × D × material rate) / dollar rate`, fetched from `box_material_rates`, with 500-unit minimum.

## SQLite and persisted data

`lib/db.js` opens `data/cardboard.db`, enables WAL, and initializes/migrates schemas at first access. Active tables are `categories`, `products`, `product_reviews`, `orders`, `stock_tracking`, `costs`, `materials`, `rolls`, `reels`, `feature_products`, `box_material_rates`, and `box_pricing_settings`.

Several fields store JSON as text: category/product images, dimensions, features, price tiers, order line items, roll/reel details, and saved-design color/artwork state. API adapters map integer IDs to string `_id` values for the UI. Preserve that contract.

The Docker Compose volume retains `public/uploads/` but does **not** mount/persist `data/cardboard.db`; deployed data durability must be verified before any operational change.

## API domains

| Domain | Relevant handlers |
| --- | --- |
| Categories/catalogue | `site-categories`, `categories`, `cardboard-types`, `getProducts/[id]`, `getSingleProductById/[id]`, `addBox`, `addMainType`, updates/deletes |
| Images | `upload`, `fetchImg/[filename]`; upload handlers write to `public/uploads` |
| Cart/orders | `create-order`, `get-orders`, `get-order-by-id/[id]`, `orderTracking/[id]`, `update-order-status/[id]` |
| Payments | `checkout`, `masterPayment` |
| Admin auth/session | `admin-login`, `checkUser`; JWT helper in `app/lib/session.js` |
| Custom designs | `featureProduct/[name]` and `saved-designs`/`saved-designs/[id]` |
| Pricing/inventory | material/cost/rate routes, rolls/reels, stock routes and vendor mutations |

`/api/v1/fetchImg/[filename]` serves local uploads and, if missing, proxies from `IMAGE_FALLBACK_ORIGIN` or production `https://cardboardpackage.com`. It constructs paths directly from the URL filename and should be security-reviewed before any exposure expansion.

## Auth and authorization

Admin login reads `data/admin-credentials.json`, compares bcrypt hash, signs a one-day JWT using `JWT_SECRET`, and puts `{ token, expiresAt }` in an HTTP-only `session` cookie. The dashboard layout validates it with `CheckUser`/`decrypt`.

Confirmed authorization inconsistency: only `categories` PUT among inspected mutating routes verifies admin session. Product CRUD, orders/status, saved designs, pricing, stock, uploads, and feature-design writes do not visibly share an authorization guard. This is a production-critical security risk and must be addressed as a dedicated backend task, not hidden inside a visual redesign.

## Checkout flow

1. Cart appends client-generated line items to localStorage-backed context.
2. “Pay Later” collects guest contact info when needed and calls `create-order` with `Unpaid`.
3. “Pay Now” posts cart data to `checkout`; server creates Stripe line items from client price fields.
4. Stripe success returns to hard-coded localhost `/success`.
5. `success/page.jsx` attempts a client-side paid-order creation only if context cart/user state is still present.

No Stripe webhook, signed payment reconciliation, server-side price validation, or reliable success session exists. Do not make cosmetic checkout claims that imply reliability this architecture does not provide.

## 3D customizer

All three scenes are client-only dynamic imports:

- Mailer: `/customTool` → `Scene` → `MailerBox` using `/MailerBox.glb`.
- Pizza: `/customTool/pizzaBox` → `PizzaScene` → `PizzaBox` using `/PizzaBox.glb`.
- Shipping: `/customTool/shippingBox` → `ShippingScene` → `ShippingBox` using `/ShippingBoxPlaneMesh.glb`.

R3F `Canvas`, Drei controls/environments/contact shadows, GLTF loading, React Spring open/close movement, and texture assignment render the preview. `DesignContianer.jsx` (name contains the existing typo), `PizzaDesignContainer.jsx`, and `ShippingDesignContainer.jsx` are interactive SVG dielines. They rasterize/apply colors/artwork transform state to the texture used by the model. `lib/featureBoxTexture.js` creates 2048px canvas textures for selected carrier-like feature designs.

This system is highly coupled through context keys, panel IDs, texture filename conventions, and GLTF UV layouts. Treat layout/responsive work around it as integration work; do not casually rename panel keys or texture paths.
