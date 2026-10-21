/**
 * Seed the four main categories with polished e-commerce content.
 * Run from project root: node scripts/seed-categories.js
 *
 * Uses: description (short, for landing), description_long (for category page), features (landing bullets), img.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const categories = [
  {
    cardboardname: "Ration Packaging Boxes",
    description:
      "Sturdy ration and grocery packaging boxes for safe storage and transport. Ideal for bulk food items, pantry goods, and wholesale distribution built for strength and durability.",
    description_long:
      "Ration packaging boxes offer dependable, safe packaging for a wide range of food products. Whether you need to pack food items, medications, or other essentials, our boxes are an ideal choice. Made from premium materials, our packaging is built to withstand the rigors of storage and transit so your products arrive in perfect condition. We offer a variety of sizes, from large boxes for bulk storage to small boxes for individual items. Easy to assemble and close with tape or straps, our ration boxes are designed for busy environments where efficiency matters.",
    features: [
      "Strong, durable construction for heavy items",
      "Ideal for bulk and wholesale distribution",
      "Safe storage and easy carriage",
      "Quick assembly with tape or straps",
    ],
    img: ["/products/Ration_Box.png"],
  },
  {
    cardboardname: "Food and Restaurant",
    description:
      "Food-safe packaging for restaurants and takeaways: pizza boxes, cake boxes, custom slice boxes, and general food packaging. Grease-resistant and designed for fresh and prepared food.",
    description_long:
      "Our food and restaurant boxes are designed to meet the specific needs of the food industry, providing durable and reliable packaging solutions for your operations. Whether you're packaging meals for delivery or storing ingredients in the kitchen, our corrugated boxes keep food fresh and secure. Made from high-quality materials, our boxes are built to handle the demands of a busy restaurant environment. Add your branding with customizable options for a professional, cohesive look. Trust our food packaging to deliver quality and convenience.",
    features: [
      "Pizza boxes, cake boxes, and food packaging",
      "Food-safe and grease-resistant materials",
      "Custom sizes for slices and portions",
      "Branding and custom print options",
    ],
    img: ["/products/Food.png"],
  },
  {
    cardboardname: "Corrugated Boxes",
    description:
      "Versatile corrugated boxes for e-commerce, apparel, gifts, laptops, tools, and corporate use. Ecommerce boxes, flat boxes, apparel boxes, gift box packaging, laptop boxes, tool boxes, cube boxes, and corporate boxes.",
    description_long:
      "Corrugated boxes for every type of business. When it comes to protecting your goods during shipping or storage, our corrugated boxes deliver strength and reliability. Made with precision and engineered for durability, they're the go-to choice for packaging everything from delicate electronics to food and household goods. Built from high-quality materials that meet rigorous industry standards, our carton cardboard provides exceptional strength so your products stay secure and protected. Whether you're shipping across the city or storing in a warehouse, our boxes offer reliable protection and peace of mind.",
    features: [
      "Ecommerce, apparel, gift box, and laptop boxes",
      "Flat, cube, and corporate options",
      "Protection and branding in one",
      "Industry-standard strength and durability",
    ],
    img: ["/products/Corrugated_Box.png"],
  },
  {
    cardboardname: "Cartons",
    description:
      "Carton boxes for shipping, moving, and storage from small paper cartons to large shipping cartons. Strong, recyclable, and suited to every packaging need at home or for business.",
    description_long:
      "Our carton boxes are the backbone of your packaging needs. We offer a wide range of options, from sturdy corrugated designs to lightweight cardboard, perfect for whatever you need to ship, store, or organize. Need packing boxes nearby? Explore our selection of packing materials in multiple sizes and thicknesses to find the right fit. Packaging doesn't have to be a hassle. With our durable carton boxes, you get exceptional strength, convenience, and affordability. Explore our collection today.",
    features: [
      "Shipping and moving cartons",
      "Multiple sizes for any need",
      "Eco-friendly and recyclable",
      "Strength and affordability in one",
    ],
    img: ["/products/Carton.png"],
  },
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, "- run the app once to create it, then run this script.");
  process.exit(1);
}

const db = new Database(dbPath);

// Ensure new columns exist
try {
  db.exec(`ALTER TABLE categories ADD COLUMN description_long TEXT`);
} catch (_) {}
try {
  db.exec(`ALTER TABLE categories ADD COLUMN features TEXT NOT NULL DEFAULT '[]'`);
} catch (_) {}

// Clear existing categories so the four main ones get ids 1–4 (for product mainType references)
db.prepare("DELETE FROM categories").run();

const insert = db.prepare(
  `INSERT INTO categories (cardboardname, description, heading, img, description_long, features) VALUES (?, ?, ?, ?, ?, ?)`
);

for (const c of categories) {
  insert.run(
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
console.log("\nDone. Seeded 4 categories. Restart the dev server and refresh the landing page.");
