/**
 * Seed Tool Boxes subcategory with Tool Box product. Sets subcategory image to product_t_1_1.jpg.
 * Run from project root: node scripts/seed-tool-boxes-products.js
 * Run after seed-categories and seed-corrugated-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Tool Boxes";

const products = [
  {
    cardboardname: "Tool Box",
    description:
      "Sturdy corrugated tool box for hand tools, hardware, and workshop supplies. Strong 3 ply kraft board keeps contents protected and organized. Ideal for trades, workshops, and storage. Flat format for easy stacking.",
    description_long: `Our tool box is built for hand tools, hardware, and workshop use. Made from strong 3 ply corrugated kraft board, it keeps your tools and parts protected during storage or transport. The flat, long format fits wrenches, screwdrivers, and small power tools without taking up extra space.

Whether you work in a workshop, on site, or at home, this box gives you a reliable way to pack and move tools. The sturdy construction withstands handling and stacking, so your gear stays in place. Use it for daily carry, job site storage, or organizing spare parts and hardware.

The brown kraft finish is tough and practical. No extra frills, just a solid box that does the job. Easy to assemble and close, so you can get packed quickly. Order in bulk for your team or keep a stack on hand for projects.

We keep packaging simple and durable. Our tool box is made from recyclable materials, so you get a practical solution without the waste.`,
    dimensions: { length: 13, width: 5, depth: 2 },
    rate: 450,
    minOrder: 10,
    quantity: 500,
    sku: "TOOL-01",
    price_tiers: [
      { pcs: 10, price: 450 },
      { pcs: 25, price: 1075 },
      { pcs: 50, price: 2100 },
      { pcs: 100, price: 4100 },
    ],
    features: [
      "13 x 5 x 2 inch, brown 3 PLY corrugated kraft board",
      "Ideal for hand tools, hardware, workshop supplies",
      "Flat format, easy to stack and store",
      "Sturdy construction for transport and storage",
    ],
    images: ["/products/product_t_1_1.jpg", "/products/product_t_1_2.jpg"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Rashid Ali", rating: 5, comment: "Perfect size for wrenches and screwdrivers. Sturdy and stacks well." },
    { authorName: "Nadia Hussain", rating: 5, comment: "We use these in the workshop. Tools stay organized and protected." },
    { authorName: "Usman Khan", rating: 5, comment: "Good for on site. Flat box fits in the van without taking much space." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "Bulk order for our team. Quality consistent, no complaints." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Best tool box we have found for the price. Will reorder." },
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

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_t_1_1.jpg"]), categoryId);
console.log("  Updated Tool Boxes subcategory image to product_t_1_1.jpg");

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
console.log("\nDone. Seeded 1 Tool Boxes product and set subcategory image. Restart dev server and refresh.");
