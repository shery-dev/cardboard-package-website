/**
 * Sequentially executes all category, subcategory, and product seed scripts
 * to populate a fresh data/cardboard.db database.
 * Run: npm run seed (or node scripts/seed-all.js)
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// If existing DB has FK constraints, clear in dependency order
const dbPath = path.join(dataDir, "cardboard.db");
try {
  const Database = require("better-sqlite3");
  const db = new Database(dbPath);
  db.pragma("foreign_keys = OFF");
  db.exec(`
    DELETE FROM product_reviews;
    DELETE FROM products;
    DELETE FROM categories;
  `);
  db.close();
} catch (_) {}

const seedScripts = [
  "seed-categories.js",
  "seed-food-restaurant-subcategories.js",
  "seed-corrugated-subcategories.js",
  "seed-ration-products.js",
  "seed-cartons-products.js",
  "seed-food-restaurant-products.js",
  "seed-pizza-boxes-products.js",
  "seed-custom-pizza-slice-products.js",
  "seed-cake-boxes-products.js",
  "seed-food-packaging-products.js",
  "seed-ecommerce-boxes-products.js",
  "seed-apparel-boxes-products.js",
  "seed-laptop-boxes-products.js",
  "seed-corporate-boxes-products.js",
  "seed-cube-boxes-products.js",
  "seed-gift-boxes-products.js",
  "seed-flat-boxes-products.js",
  "seed-tool-boxes-products.js",
  "seed-kraft-paper-products.js",
];

console.log("==================================================");
console.log("Seeding Cardboard Package SQLite Database...");
console.log("==================================================");

for (const script of seedScripts) {
  const scriptPath = path.join(__dirname, script);
  console.log(`\n-> Running ${script}...`);
  try {
    execSync(`"${process.execPath}" "${scriptPath}"`, { stdio: "inherit" });
  } catch (err) {
    console.error(`Error running ${script}:`, err.message);
  }
}

console.log("\n==================================================");
console.log("All categories & catalog products successfully seeded!");
console.log("==================================================");
