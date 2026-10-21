/**
 * Seed the 8 Corrugated Boxes subcategories. Main category shows all products; each subcategory page shows only its products.
 * Run from project root: node scripts/seed-corrugated-subcategories.js
 * Run after seed-categories.js so "Corrugated Boxes" exists.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORIES = [
  {
    cardboardname: "Ecommerce Boxes",
    description: "Shipping and mailer boxes for online stores. Strong, consistent sizes for orders and returns. Ideal for ecommerce and direct to consumer.",
    description_long:
      "Our ecommerce boxes are built for online retail. Whether you ship clothing, cosmetics, electronics or general merchandise, these corrugated boxes protect your products and present your brand. Consistent dimensions and easy assembly help streamline packing. Choose from standard sizes or discuss custom options for your catalog.",
    features: [
      "Designed for online retail and D2C",
      "Strong construction for shipping",
      "Consistent sizes for efficient packing",
      "Custom branding available",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Flat Boxes",
    description: "Low profile flat boxes for documents, prints, apparel and flat items. Space efficient and post friendly.",
    description_long:
      "Flat boxes offer a low profile for items that do not need depth. Use them for documents, artwork, prints, clothing, textiles or any flat product. They are space efficient for storage and shipping and often qualify for lower postage. Sturdy corrugated construction keeps contents flat and protected.",
    features: [
      "Low profile for flat items",
      "Space efficient storage and shipping",
      "Suitable for documents, prints, apparel",
      "Post friendly dimensions",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Gift Boxes",
    description: "Presentation gift boxes for retail and gifting. Elevate unboxing with sturdy, brandable boxes for any occasion.",
    description_long:
      "Gift boxes turn your product into a present. Our corrugated gift boxes are strong enough for shipping and refined enough for retail. Use them for hampers, premium products, seasonal gifts or corporate gifting. Add tissue, ribbon or your logo for a memorable unboxing experience.",
    features: [
      "Presentation ready for gifting",
      "Strong enough for shipping",
      "Brandable for retail and corporate",
      "Suitable for hampers and premium products",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Apparel Boxes",
    description: "Boxes for clothing, shoes and accessories. Protect garments and support brand presentation for fashion and lifestyle brands.",
    description_long:
      "Apparel boxes are made for fashion and lifestyle brands. They protect clothing, shoes and accessories in transit and support a strong brand image at unboxing. Our corrugated options suit everything from single items to multi piece orders. Custom sizing and printing help you stand out in a competitive market.",
    features: [
      "Designed for clothing and accessories",
      "Protection and brand presentation",
      "Single item to multi piece options",
      "Custom sizing and printing",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Laptop Boxes",
    description: "Secure packaging for laptops and electronics. Cushioned, dimensioned options to reduce damage and returns.",
    description_long:
      "Laptop and electronics boxes are built to protect high value, fragile items. We offer dimensioned options and cushioning solutions so devices arrive safely. Sturdy construction and reliable closure reduce damage and returns. Ideal for IT retailers, brands and B2B shipping.",
    features: [
      "Dimensioned for laptops and devices",
      "Protection focused construction",
      "Reduces damage and returns",
      "Suitable for IT and B2B",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Tool Boxes",
    description: "Heavy duty boxes for tools, parts and hardware. Strong corrugated construction for workshop and trade use.",
    description_long:
      "Tool boxes are built for weight and durability. Use them for hand tools, power tool kits, spare parts or hardware. Our heavy duty corrugated options withstand handling and stacking in workshops, vehicles and warehouses. Reliable closure and optional dividers keep contents organised and secure.",
    features: [
      "Heavy duty for tools and hardware",
      "Withstands handling and stacking",
      "Workshop and trade use",
      "Optional dividers and organisation",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Cube Boxes",
    description: "Square and cube format boxes for storage and shipping. Stackable, space efficient and versatile.",
    description_long:
      "Cube boxes offer a square or near square format that is easy to stack and store. They suit products that do not need a long or flat format and work well for kitting, storage and shipping. Consistent dimensions and strong construction make them a versatile choice for many industries.",
    features: [
      "Square or cube format",
      "Stackable and space efficient",
      "Versatile for kitting and storage",
      "Consistent dimensions",
    ],
    img: ["/img/logo.svg"],
  },
  {
    cardboardname: "Corporate Boxes",
    description: "Professional packaging for B2B, corporate gifting and bulk. Brandable, reliable boxes for business use.",
    description_long:
      "Corporate boxes meet the needs of business to business and corporate gifting. They are strong enough for bulk shipping and refined enough for premium gifting or client presentations. Use them for samples, promotional packs, employee kits or branded giveaways. Custom printing and sizing support your corporate identity.",
    features: [
      "Professional B2B and corporate use",
      "Bulk shipping and gifting",
      "Brandable for corporate identity",
      "Samples, promos and giveaways",
    ],
    img: ["/img/logo.svg"],
  },
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories first.");
  process.exit(1);
}

const db = new Database(dbPath);

const parentRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ? AND parent_id IS NULL").get("Corrugated Boxes");
if (!parentRow) {
  console.error("Category 'Corrugated Boxes' not found. Run 'npm run seed:categories' first.");
  db.close();
  process.exit(1);
}

const parentId = parentRow.id;

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
console.log("\nDone. Seeded 8 Corrugated Boxes subcategories. Restart dev server and refresh.");
