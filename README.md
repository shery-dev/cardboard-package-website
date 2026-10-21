<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.1.4-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<h1 align="center">CardboardPackage</h1>

<p align="center">
  <strong>Full-stack e-commerce and business management system for the packaging industry with 3D product previews, Stripe payments, and 20+ seed scripts</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-data-models">Models</a> •
  <a href="#-seed-scripts">Seeds</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## Overview

A production e-commerce platform for **cardboardpackage.com** — built for a packaging company to manage their product catalog, handle customer orders, and process payments. Features 3D product visualization with Three.js, Stripe payment integration, image upload with Sharp processing, and a comprehensive admin dashboard.

| Feature | Details |
|---------|---------|
| **Product catalog** | 10+ product categories (pizza boxes, e-commerce, gift, apparel, kraft paper, etc.) |
| **3D previews** | Three.js + React Three Fiber for interactive box visualization |
| **Payments** | Stripe integration for checkout and payment processing |
| **Image handling** | Sharp for image optimization, Multer for uploads |
| **Admin** | Full dashboard for products, orders, inventory, pricing |
| **Auth** | NextAuth 4.24.7 + JWT (jose) + bcrypt |
| **Animations** | Framer Motion + Lottie for UI animations |
| **Seeding** | 20+ seed scripts for populating product categories and inventory |

---

## Quick Start

```bash
git clone https://github.com/reallyticsai/CardboardPackage_NextJS-Ver.git
cd CardboardPackage_NextJS-Ver

npm install          # Uses native modules — needs python3, make, g++

# Environment (.env.local)
# MONGODB_URI=...
# NEXTAUTH_SECRET=...
# STRIPE_SECRET_KEY=...
# STRIPE_PUBLISHABLE_KEY=...

npm run dev --turbo  # http://localhost:3000 (uses Turbopack)
```

### Seed the database

```bash
npm run seed:admin              # Create admin user
npm run seed:categories         # Product categories
npm run seed:ration             # Ration products
npm run seed:cartons            # Carton products
npm run seed:pizza-boxes        # Pizza boxes
npm run seed:ecommerce-boxes    # E-commerce boxes
npm run seed:apparel-boxes      # Apparel boxes
npm run seed:cake-boxes         # Cake boxes
npm run seed:gift-boxes         # Gift boxes
npm run seed:corporate-boxes    # Corporate boxes
npm run seed:food-packaging     # Food packaging
npm run seed:kraft-paper        # Kraft paper products
npm run seed:laptop-boxes       # Laptop boxes
npm run seed:tool-boxes         # Tool boxes
npm run seed:flat-boxes         # Flat boxes
npm run seed:cube-boxes         # Cube boxes
npm run update-password         # Update admin password
```

---

## Project Structure

```
CardboardPackage_NextJS-Ver/
├── app/
│   ├── (home)/                # Public storefront
│   ├── (dashboard)/           # Admin dashboard
│   ├── api/                   # REST API routes
│   └── lib/                   # Shared utilities
│
├── models/                    # 10 Mongoose schemas
│   ├── CardboardProduct.js    # Product: name, images, dimensions, pricing
│   ├── CardboardType.js       # Categories and subcategories
│   ├── Cost.js                # Pricing rules
│   ├── FeatureProduct.js      # Featured/promoted products
│   ├── MaterialModel.js       # Raw materials inventory
│   ├── Order.js               # Customer orders
│   ├── ReelsModel.js          # Reel stock tracking
│   ├── RollModel.js           # Roll stock tracking
│   ├── StockTracking.js       # Inventory tracking
│   └── Users.js               # User accounts
│
├── components/                # React components
├── context/
│   └── Context.jsx            # Global app context (cart, auth state)
│
├── middlewares/
│   ├── multerMiddleWare.js    # File upload (Multer)
│   ├── uploadImages.js        # Image upload processing
│   └── deleteImages.js        # Image cleanup
│
├── lib/
│   ├── db.js                  # MongoDB connection
│   └── featureBoxTexture.js   # 3D texture data for Three.js
│
├── scripts/                   # 20+ database seed scripts
├── docs/                      # Documentation
├── public/                    # Static assets
├── Dockerfile                 # node:20-slim (Debian for native modules)
└── docker-compose.yml         # Port 3001
```

---

## Data Models

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `CardboardProduct` | name, images[], dimensions, price, category, stock | Main product catalog |
| `CardboardType` | name, slug, subcategories[] | Category hierarchy |
| `Order` | user, items[], total, status, payment | Customer orders |
| `Cost` | material, rates, calculations | Pricing engine |
| `StockTracking` | product, quantity, movements[] | Inventory |
| `MaterialModel` | type, grade, specifications | Raw materials |
| `ReelsModel` / `RollModel` | dimensions, weight, stock | Paper reel/roll inventory |

---

## Deployment

```bash
# Docker (needs Debian base for sharp, bcrypt, better-sqlite3)
docker-compose up --build     # Port 3001, ~2.4 GB image

# Server: /var/www/cardboardpackage.com
# Domain: cardboardpackage.com → 127.0.0.1:3001
```

### Notes
- Uses **Turbopack** for dev (`next dev --turbo`)
- Docker image is **Debian-based** (not Alpine) due to native modules (sharp, bcrypt, better-sqlite3)
- Image size ~2.4 GB due to 3D + image processing dependencies

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14.1.4 (App Router, Turbopack) |
| Language | JavaScript (ES6+) |
| Database | MongoDB via Mongoose 8.2.3 |
| Payments | Stripe (stripe 15.8.0, @stripe/stripe-js 3.4.1) |
| Auth | NextAuth 4.24.7, JWT (jose), bcryptjs |
| 3D | Three.js 0.164.1, React Three Fiber, Drei, React Spring |
| Images | Sharp 0.33.4 (optimization), Multer (uploads) |
| Animation | Framer Motion 12.10.3, Lottie |
| UI | TailwindCSS 3.3.0, Flowbite, React Icons |
| Container | Docker (node:20-slim) |