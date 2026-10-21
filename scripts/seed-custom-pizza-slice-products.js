/**
 * Seed Custom Pizza Slice Box subcategory with 1 product (Big Slice Pizza Box).
 * Sets subcategory image to product_s_1_1.jpg.
 * Run from project root: node scripts/seed-custom-pizza-slice-products.js
 * Run after seed-categories and seed-food-restaurant-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Custom Pizza Slice Box";

const products = [
  {
    cardboardname: "Big Slice Pizza Box",
    description:
      "20 inch slice pizza box for large slices and big pizzas. Durable, food-grade kraft board for reliable protection during handling and delivery. Easy to assemble with secure lids.",
    description_long: `Our Big Slice Pizza Box is built to hold your largest, most appetising pizzas. The 20 inch pizza box keeps your pizzas fresh and delicious, whether you are delivering to customers or preparing for a special event.

Made from durable materials, our 20 inch slice pizza box is strong and reliable. It gives your pizzas the protection they need during handling and delivery. The large size lets you present your pizzas at their best, so they look as good as they taste.

The design is simple to assemble and use, so it fits easily into busy kitchens. The secure lid keeps your pizzas in place, so you can be confident they will arrive in perfect condition.

We design our Big Slice Pizza Box to meet high standards of strength and reliability. When you choose us for your packaging, you get a product that lasts. Upgrade your pizza packaging with our Big Slice Pizza Box and make sure your pizzas always make a strong impression.`,
    dimensions: { length: 20, width: 20, depth: 2 },
    rate: 165,
    minOrder: 5,
    quantity: 500,
    sku: "FB-SLICE-20",
    price_tiers: [
      { pcs: 5, price: 165 },
      { pcs: 10, price: 310 },
      { pcs: 25, price: 725 },
      { pcs: 50, price: 1350 },
      { pcs: 100, price: 2500 },
    ],
    features: [
      "20 inch, brown kraft board",
      "3 ply food-grade kraft (inner and outer)",
      "Large size for big slices and whole pizzas",
      "Secure lid, easy to assemble",
    ],
    images: ["/products/product_s_1_1.jpg", "/products/product_s_1_2.jpg"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Tariq Mahmood", rating: 5, comment: "Perfect for our large slices. Sturdy and keeps pizza hot." },
    { authorName: "Sana Ahmed", rating: 5, comment: "Big size is exactly what we needed. Good quality." },
    { authorName: "Imran Khan", rating: 5, comment: "Easy to close and stack. No complaints." },
    { authorName: "Amina Hassan", rating: 5, comment: "Customers love the presentation. Will reorder." },
    { authorName: "Farhan Rashid", rating: 5, comment: "Reliable for delivery. Holds up well." },
  ],
];

const reviewDates = [
  "2024-04-10 10:00:00", "2024-07-22 14:30:00", "2024-10-05 09:15:00", "2025-01-18 11:45:00", "2025-05-02 16:00:00",
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories/subcategories first.");
  process.exit(1);
}

const db = new Database(dbPath);

const catRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ? AND parent_id IS NOT NULL").get(SUBCATEGORY_NAME);
if (!catRow) {
  console.error("Subcategory '" + SUBCATEGORY_NAME + "' not found. Run seed-food-restaurant-subcategories.js first.");
  db.close();
  process.exit(1);
}

const categoryId = catRow.id;

db.prepare("DELETE FROM product_reviews WHERE productId IN (SELECT id FROM products WHERE mainType = ?)").run(categoryId);
db.prepare("DELETE FROM products WHERE mainType = ?").run(categoryId);

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_s_1_1.jpg"]), categoryId);
console.log("  Updated Custom Pizza Slice Box subcategory image to product_s_1_1.jpg");

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
  reviews.forEach((r, j) => {
    const createdAt = reviewDates[j] || reviewDates[0];
    insertReview.run(productId, r.authorName, r.rating, r.comment, createdAt);
  });
}

db.close();
console.log("\nDone. Seeded 1 Custom Pizza Slice Box product and set subcategory image. Restart dev server and refresh.");
