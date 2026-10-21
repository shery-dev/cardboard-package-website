/**
 * Seed Laptop Boxes subcategory with Laptop Box (from Ecommerce). Sets subcategory image to product_e_1_1.jpg.
 * Run from project root: node scripts/seed-laptop-boxes-products.js
 * Run after seed-categories and seed-corrugated-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Laptop Boxes";

const products = [
  {
    cardboardname: "Laptop Box",
    description:
      "Custom sized laptop boxes made from strong corrugated cardboard for secure shipping, storage, or gifting. Multiple sizes to fit your laptop. Soft inner lining protects from scratches.",
    description_long: `Our laptop box provides strong protection for your valuable device. Made from quality, sturdy materials, these laptop boxes come in multiple sizes to fit your laptop and keep it safe during shipping.

We understand that laptops come in all shapes and sizes. We offer a range of packaging options to fit yours snugly so your device does not bounce around inside a box that is too big. Our laptop boxes are designed to keep your machine safe from bumps and knocks. The sturdy cardboard provides protection against daily wear and tear, and the soft inner lining cushions your device and helps prevent scratches.

If you are sending your laptop for repairs or gifting a new one, our laptop boxes give you peace of mind. The secure lid keeps your device in place and the sturdy design can handle the demands of shipping. They also work as storage when the laptop is not in use, keeping it dust-free and protected on a shelf or in a cupboard.`,
    dimensions: { length: 18.5, width: 14, depth: 3.5 },
    rate: 700,
    minOrder: 5,
    quantity: 500,
    sku: "LAPTOP-01",
    price_tiers: [
      { pcs: 5, price: 700 },
      { pcs: 10, price: 1400 },
      { pcs: 15, price: 2100 },
      { pcs: 20, price: 2800 },
    ],
    features: [
      "18.5 x 14 x 3.5 inch, brown 3 ply corrugated kraft board",
      "Ideal for laptops, jackets, shirts, baby blankets",
      "Soft inner lining, secure closure",
      "Multiple sizes available",
    ],
    images: ["/products/product_e_4_1.jpg", "/products/product_e_4_2.jpg"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Bushra Khan", rating: 5, comment: "Laptop arrived safe. Perfect fit and soft lining inside." },
    { authorName: "Junaid Ali", rating: 5, comment: "We use for repairs and gifting. Sturdy and professional." },
    { authorName: "Sana Parveen", rating: 5, comment: "Multiple sizes available. No more oversized boxes." },
    { authorName: "Rizwan Hussain", rating: 5, comment: "Great for storage too. Keeps dust off when not in use." },
    { authorName: "Nabeel Sheikh", rating: 5, comment: "Best laptop box we have used. Recommended." },
  ],
];

const reviewDates = [
  "2024-03-12 10:00:00", "2024-06-20 14:30:00", "2024-09-05 09:15:00", "2025-01-08 11:45:00", "2025-04-22 16:00:00",
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories/subcategories first.");
  process.exit(1);
}

const db = new Database(dbPath);

const catRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ? AND parent_id IS NOT NULL").get(SUBCATEGORY_NAME);
if (!catRow) {
  console.error("Subcategory '" + SUBCATEGORY_NAME + "' not found. Run seed-corrugated-subcategories.js first.");
  db.close();
  process.exit(1);
}

const categoryId = catRow.id;

db.prepare("DELETE FROM product_reviews WHERE productId IN (SELECT id FROM products WHERE mainType = ?)").run(categoryId);
db.prepare("DELETE FROM products WHERE mainType = ?").run(categoryId);

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_e_1_1.jpg"]), categoryId);
console.log("  Updated Laptop Boxes subcategory image to product_e_1_1.jpg");

const insertProduct = db.prepare(`
  INSERT INTO products (mainType, cardboardname, description, rate, quantity, minOrder, dimensions, images, sku, price_tiers, description_long, features)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertReview = db.prepare(`
  INSERT INTO product_reviews (productId, authorName, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?)
`);

for (let i = 0; i < products.length; i++) {
  const p = products[i];
  insertProduct.run(
    categoryId,
    p.cardboardname,
    p.description,
    p.rate,
    p.quantity,
    p.minOrder,
    JSON.stringify(p.dimensions),
    JSON.stringify(p.images),
    p.sku,
    JSON.stringify(p.price_tiers),
    p.description_long,
    JSON.stringify(p.features)
  );
  const productId = db.prepare("SELECT last_insert_rowid() as id").get().id;
  console.log("  +", p.cardboardname, "| SKU:", p.sku);

  const reviews = reviewsByProduct[i] || [];
  const dateOffset = i * 5;
  reviews.forEach((r, j) => {
    const createdAt = reviewDates[dateOffset + j] || reviewDates[j % reviewDates.length];
    insertReview.run(productId, r.authorName, r.rating, r.comment, createdAt);
  });
}

db.close();
console.log("\nDone. Seeded 1 Laptop Boxes product and set subcategory image. Restart dev server and refresh.");
