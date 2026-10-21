/**
 * Seed the 4 Food and Restaurant subcategories: Pizza Boxes, Custom Pizza Slice Box, Cake Boxes, Food Packaging Box.
 * Run from project root: node scripts/seed-food-restaurant-subcategories.js
 * Run after seed-categories.js so "Food and Restaurant" exists.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORIES = [
  {
    cardboardname: "Pizza Boxes",
    description: "Sturdy, grease-resistant pizza boxes for delivery and takeaway. Keep pizzas hot and secure in multiple sizes.",
    description_long:
      "Our pizza boxes are built for the demands of pizzerias and restaurants. Made from food-safe, grease-resistant materials, they keep your pizzas hot during delivery and present them perfectly to your customers. We offer a range of sizes to fit small personal pizzas up to large family sizes, with secure closures and optional ventilation to prevent sogginess. Durable construction ensures your pizzas arrive in great condition every time.",
    features: [
      "Grease-resistant and food-safe materials",
      "Multiple sizes for personal to family pizzas",
      "Secure closure and optional ventilation",
      "Ideal for delivery and takeaway",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Custom Pizza Slice Box",
    description: "Single-slice and portion pizza boxes for slices and small orders. Perfect for food courts and grab-and-go.",
    description_long:
      "Custom pizza slice boxes are designed for single slices, half pizzas, or portion-sized orders. Whether you run a food court stall, a slice counter, or need to pack individual portions for events, our slice boxes keep each portion secure and presentable. The compact design reduces waste and fits easily in bags. Choose from standard slice sizes or request custom dimensions to match your menu.",
    features: [
      "Single-slice and portion sizes",
      "Compact, easy to carry design",
      "Food-safe and grease-resistant",
      "Custom sizes available",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Cake Boxes",
    description: "Presentation-ready cake boxes for bakeries and patisseries. Protect and display cakes, pastries, and desserts.",
    description_long:
      "Our cake boxes combine protection with presentation. Whether you are shipping a birthday cake, displaying pastries in a bakery, or sending desserts for delivery, these boxes keep your products safe and looking their best. Sturdy construction prevents crushing, and clear window options let customers see the product. Available in round and rectangular formats, with inserts and dividers for cupcakes and smaller items.",
    features: [
      "Presentation-ready for bakeries and patisseries",
      "Round and rectangular options",
      "Clear window and divider options",
      "Strong construction to prevent crushing",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Food Packaging Box",
    description: "General-purpose food packaging boxes for takeaways, meal prep, and restaurant use. Versatile and food-safe.",
    description_long:
      "Our food boxes are versatile packaging solutions for restaurants, cafés, and food businesses. Use them for takeaways, meal prep, salads, sandwiches, or hot meals. Made from food-safe materials that resist grease and moisture, they keep food fresh and secure during transport. Available in multiple sizes and styles to suit your menu. Add your logo or branding for a professional finish.",
    features: [
      "Versatile for takeaways and meal prep",
      "Food-safe, grease and moisture resistant",
      "Multiple sizes and styles",
      "Branding and custom print options",
    ],
    img: ["/img/logo.svg"],
  },
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories first.");
  process.exit(1);
}

const db = new Database(dbPath);

const parentRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ?").get("Food and Restaurant");
if (!parentRow) {
  console.error("Category 'Food and Restaurant' not found. Run 'npm run seed:categories' first.");
  db.close();
  process.exit(1);
}

const parentId = parentRow.id;

// Remove existing subcategories of Food and Restaurant so we can re-seed cleanly
db.prepare("DELETE FROM categories WHERE parent_id = ?").run(parentId);

const insert = db.prepare(
  `INSERT INTO categories (parent_id, cardboardname, description, heading, img, description_long, features) VALUES (?, ?, ?, ?, ?, ?, ?)`
);

for (const c of SUBCATEGORIES) {
  insert.run(
    parentId,
    c.cardboardname,
    c.description,
    null,
    JSON.stringify(c.img),
    c.description_long,
    JSON.stringify(c.features)
  );
  console.log("  +", c.cardboardname);
}

db.close();
console.log("\nDone. Seeded 4 Food and Restaurant subcategories. Restart dev server and refresh.");
