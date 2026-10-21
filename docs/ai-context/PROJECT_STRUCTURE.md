# Project structure

Only material source locations are listed below. Generated directories and dependencies are intentionally excluded.

| Path | Responsibility |
| --- | --- |
| `app/(home)/` | Public-storefront route group and its root layout (navbar, footer, context, metadata, Inter/Lora). |
| `app/(dashboard)/` | Admin route group/root layout; validates admin session and renders fixed Flowbite sidebar. |
| `app/(home)/page.jsx` | Composes the current home sections. |
| `app/(home)/cardboard/products-list/[id]/page.jsx` | Category fetch/detail page. |
| `app/(home)/product-display/[id]/page.jsx` | Product detail chooser; switches legacy vs tiered/Amazon-style detail UI. |
| `app/(home)/customTool/` | Customizer route wrappers; scenes are dynamically loaded without SSR. |
| `app/(home)/shopping-cart`, `success`, `cancel` | Cart and payment-result routes. |
| `app/(home)/quotes`, `faq`, `rolls`, `reels` | Quote, information, and materials/inventory-oriented customer routes. |
| `app/(home)/admin-login` | Custom admin sign-in screen. |
| `app/(dashboard)/admin/` | Dashboard, category/product/order/inventory/rate/saved-design management routes. |
| `app/api/v1/` | Route handlers for catalogue, order, auth, files, custom designs, pricing, and inventory. |
| `app/globals.css` | Global Tailwind entry point plus custom 3D/editor/loader styles. |
| `app/lib/session.js` | JWT verification helper used by server session checks. |
| `components/HomePage/` | Homepage sections: hero, product showcase, brands, solutions, inspiration, FAQ, payments. |
| `components/CardboardPage/` | Category hero/grid and product-detail/configuration components. |
| `components/shoppingCartPage/` | Cart item list/card and total. |
| `components/RequestQuotes/` | Quote form UI; currently presentation-only. |
| `components/Dashboard/` | Admin sidebar, table containers/tables, and CRUD/inventory forms. |
| `components/Manipulator/` | Customizer shell, 2D dieline editors, 3D scenes/box meshes, options, pricing card. |
| `components/Manipulator/3dWork/Boxes/` | `MailerBox`, `PizzaBox`, `ShippingBox` GLTF/texture mesh implementations. |
| `context/Context.jsx` | Global client state: cart, nav, 3D material/size/side colors/artwork/tool state, order flags. |
| `lib/db.js` | SQLite singleton and schema/migration initialization. |
| `lib/featureBoxTexture.js` | Browser canvas texture synthesis for featured carrier-branded designs. |
| `data/` | SQLite database/WAL files plus fallback categories/brands/payment data; credentials file exists but must never be read into documentation. |
| `public/` | Static logo, campaign/catalog imagery, uploads, textures, GLBs, and featured-brand assets. |
| `scripts/` | Mostly SQLite catalogue seed scripts; `seed-admin.js` and `update-admin-password.js` still contain legacy MongoDB code and conflict with local SQLite docs. |
| `models/`, `middlewares/` | Legacy Mongoose/Multer modules, not referenced by active app/API imports. |
| `tailwind.config.js` | Current legacy palette/fonts and Flowbite scanning/plugin setup. |
| `Dockerfile`, `docker-compose.yml` | Debian-based production build/runtime; Compose persists uploads only. |

## Route inventory

Public routes include `/`, `/cardboard`, `/cardboard/products-list/[id]`, `/product-display/[id]`, `/customTool`, `/customTool/pizzaBox`, `/customTool/shippingBox`, `/shopping-cart`, `/quotes`, `/faq`, `/rolls`, `/reels`, `/admin-login`, order-history/profile legacy pages, and payment result pages.

Admin routes include `/admin`, categories/products, product detail/edit routes, orders/order details, rates, rolls/reels and stock movements, stock history, materials/costs, and saved designs. Some listed admin pages are no longer linked in the sidebar but remain routable.
