/**
 * Seed products for Food and Restaurant subcategories: Pizza Boxes, Custom Pizza Slice Box, Cake Boxes, Food Box.
 * Run from project root: node scripts/seed-food-restaurant-products.js
 * Run after seed-categories.js and seed-food-restaurant-subcategories.js.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const PRODUCTS_BY_SUBCATEGORY = {
  "Pizza Boxes": [
    {
      cardboardname: "Pizza Box 10 Inch",
      description: "Classic 10 inch pizza box for small to medium pizzas. Grease-resistant, sturdy, and ideal for delivery.",
      description_long:
        "Our 10 inch pizza box is the go-to choice for small and medium pizzas. Made from food-safe, grease-resistant cardboard, it keeps your pizza hot and secure during transit. The secure fold-over design and optional ventilation help maintain crispness. Perfect for pizzerias and restaurants with high delivery volume.",
      dimensions: { length: 10, width: 10, depth: 1.5 },
      rate: 25,
      minOrder: 50,
      quantity: 500,
      sku: "FB-PIZ-10",
      price_tiers: [{ pcs: 50, price: 1250 }, { pcs: 100, price: 2200 }, { pcs: 250, price: 5000 }],
      features: [
        "10 inch square, 1.5 inch depth",
        "Grease-resistant material",
        "Suitable for small to medium pizzas",
        "Bulk pricing available",
      ],
      images: ["/img/logo.svg"],
    },
    {
      cardboardname: "Pizza Box 12 Inch",
      description: "Standard 12 inch pizza box for medium and large pizzas. Reliable and cost-effective for takeaways.",
      description_long:
        "The 12 inch pizza box fits most medium and large pizzas and is built to withstand stacking and delivery. Food-safe and grease-resistant, it protects your product from the oven to the customer. Easy to assemble and close, with options for custom printing to promote your brand.",
      dimensions: { length: 12, width: 12, depth: 1.75 },
      rate: 32,
      minOrder: 50,
      quantity: 500,
      sku: "FB-PIZ-12",
      price_tiers: [{ pcs: 50, price: 1600 }, { pcs: 100, price: 3000 }, { pcs: 250, price: 7000 }],
      features: [
        "12 inch square, 1.75 inch depth",
        "Stackable and delivery-ready",
        "Custom printing available",
        "Bulk discounts",
      ],
      images: ["/img/logo.svg"],
    },
  ],
  "Custom Pizza Slice Box": [
    {
      cardboardname: "Single Slice Pizza Box",
      description: "Compact box for one pizza slice. Ideal for food courts, slice counters, and events.",
      description_long:
        "Our single-slice pizza box is designed for grab-and-go sales and events. It holds one large slice securely and fits in a bag or tray. Grease-resistant and food-safe, it keeps the slice warm and presentable. Low cost per unit makes it ideal for high-volume slice sales.",
      dimensions: { length: 6, width: 5, depth: 1 },
      rate: 8,
      minOrder: 100,
      quantity: 1000,
      sku: "FB-SLICE-1",
      price_tiers: [{ pcs: 100, price: 800 }, { pcs: 500, price: 3500 }, { pcs: 1000, price: 6500 }],
      features: [
        "Fits one large slice",
        "Compact and portable",
        "Food-safe and grease-resistant",
        "High-volume friendly",
      ],
      images: ["/img/logo.svg"],
    },
  ],
  "Cake Boxes": [
    {
      cardboardname: "Round Cake Box 8 Inch",
      description: "Round cake box for 8 inch cakes. Sturdy base and lid for safe transport and presentation.",
      description_long:
        "Our 8 inch round cake box is perfect for birthday cakes, small gateaux, and single-tier desserts. The rigid construction prevents crushing, and the secure lid keeps the cake safe during delivery. Optional clear window available for display. Ideal for bakeries and home bakers.",
      dimensions: { length: 8, width: 8, depth: 5 },
      rate: 45,
      minOrder: 20,
      quantity: 200,
      sku: "FB-CAKE-8",
      price_tiers: [{ pcs: 20, price: 900 }, { pcs: 50, price: 2100 }, { pcs: 100, price: 4000 }],
      features: [
        "8 inch round, 5 inch height",
        "Rigid construction",
        "Optional clear window",
        "Ideal for bakeries",
      ],
      images: ["/img/logo.svg"],
    },
    {
      cardboardname: "Cupcake Box 4 Piece",
      description: "Four-compartment cupcake box for gifting and takeaway. Keeps cupcakes secure and presentable.",
      description_long:
        "This four-piece cupcake box holds four standard cupcakes in individual compartments to prevent damage. The window lid option lets customers see the product. Sturdy and easy to carry, it is ideal for bakeries, cafés, and event catering.",
      dimensions: { length: 9, width: 6, depth: 3 },
      rate: 35,
      minOrder: 25,
      quantity: 300,
      sku: "FB-CUP-4",
      price_tiers: [{ pcs: 25, price: 875 }, { pcs: 50, price: 1650 }, { pcs: 100, price: 3200 }],
      features: [
        "Holds 4 cupcakes",
        "Individual compartments",
        "Window lid option",
        "Gift and takeaway ready",
      ],
      images: ["/img/logo.svg"],
    },
  ],
  "Food Packaging Box": [],
  "_FoodBoxLegacy": [
    {
      cardboardname: "Takeaway Food Box Small",
      description: "Small takeaway box for sandwiches, wraps, or single portions. Grease-resistant and leak-resistant.",
      description_long:
        "Our small takeaway food box is versatile for sandwiches, wraps, burgers, or single-portion meals. Made from food-safe, grease-resistant material, it keeps food fresh and contained. Secure closure and compact size make it ideal for cafés and quick-service restaurants.",
      dimensions: { length: 7, width: 5, depth: 3 },
      rate: 15,
      minOrder: 50,
      quantity: 500,
      sku: "FB-TAW-S",
      price_tiers: [{ pcs: 50, price: 750 }, { pcs: 100, price: 1400 }, { pcs: 250, price: 3250 }],
      features: [
        "Small size for single portions",
        "Grease and leak resistant",
        "Secure closure",
        "Versatile for cafés and QSR",
      ],
      images: ["/img/logo.svg"],
    },
    {
      cardboardname: "Takeaway Food Box Large",
      description: "Large takeaway box for meals, combos, or family portions. Sturdy and presentable.",
      description_long:
        "The large takeaway food box is designed for full meals, combo deals, or family-sized orders. Strong construction and a secure lid keep contents in place during delivery. Food-safe and suitable for hot or cold items. Custom branding available for a professional look.",
      dimensions: { length: 10, width: 8, depth: 4 },
      rate: 28,
      minOrder: 50,
      quantity: 400,
      sku: "FB-TAW-L",
      price_tiers: [{ pcs: 50, price: 1400 }, { pcs: 100, price: 2600 }, { pcs: 250, price: 6000 }],
      features: [
        "Large size for meals and combos",
        "Sturdy and presentable",
        "Suitable for hot or cold",
        "Custom branding available",
      ],
      images: ["/img/logo.svg"],
    },
  ],
};

const REVIEWS_BY_PRODUCT = [
  [
    { authorName: "Rashid Ali", rating: 5, comment: "Perfect for our 10 inch pizzas. No grease soak." },
    { authorName: "Sana Khan", rating: 5, comment: "Good value in bulk. Delivery was quick." },
  ],
  [
    { authorName: "Imran Hassan", rating: 5, comment: "Standard quality we needed. Will reorder." },
    { authorName: "Amina Sheikh", rating: 5, comment: "Stacks well. Fits our medium pizzas perfectly." },
  ],
  [
    { authorName: "Farhan Malik", rating: 5, comment: "Ideal for our slice counter. Customers like it." },
  ],
  [
    { authorName: "Zara Ahmed", rating: 5, comment: "Cakes arrive safe. Good presentation." },
    { authorName: "Bilal Noor", rating: 5, comment: "Using for birthday cakes. No complaints." },
  ],
  [
    { authorName: "Hina Riaz", rating: 5, comment: "Cupcake box is sturdy. Great for gifting." },
  ],
  [
    { authorName: "Waqas Choudhry", rating: 5, comment: "Small box is perfect for wraps. Good quality." },
  ],
  [
    { authorName: "Sadia Farooq", rating: 5, comment: "Large box holds full meal. Stays closed." },
  ],
];

const REVIEW_DATES = [
  "2024-06-10 10:00:00", "2025-01-15 14:30:00",
  "2024-08-22 09:00:00", "2025-02-10 11:00:00",
  "2024-11-05 16:00:00",
  "2024-07-18 10:30:00", "2025-03-01 09:45:00",
  "2024-09-12 13:00:00",
  "2024-10-01 11:20:00",
  "2025-01-28 15:00:00",
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories/subcategories first.");
  process.exit(1);
}

const db = new Database(dbPath);

const parentRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ?").get("Food and Restaurant");
if (!parentRow) {
  console.error("Category 'Food and Restaurant' not found. Run seed-categories.js first.");
  db.close();
  process.exit(1);
}

const subRows = db.prepare("SELECT id, cardboardname FROM categories WHERE parent_id = ?").all(parentRow.id);
if (subRows.length === 0) {
  console.error("No subcategories found. Run seed-food-restaurant-subcategories.js first.");
  db.close();
  process.exit(1);
}

const subIds = subRows.map((r) => r.id);
db.prepare("DELETE FROM product_reviews WHERE productId IN (SELECT id FROM products WHERE mainType IN (" + subIds.map(() => "?").join(",") + "))").run(...subIds);
db.prepare("DELETE FROM products WHERE mainType IN (" + subIds.map(() => "?").join(",") + ")").run(...subIds);

const insertProduct = db.prepare(`
  INSERT INTO products (mainType, cardboardname, description, rate, quantity, minOrder, dimensions, images, sku, price_tiers, description_long, features)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertReview = db.prepare(`
  INSERT INTO product_reviews (productId, authorName, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?)
`);

let reviewIndex = 0;
let dateIndex = 0;

for (const sub of subRows) {
  const products = PRODUCTS_BY_SUBCATEGORY[sub.cardboardname];
  if (!products || products.length === 0) continue;

  for (const p of products) {
    insertProduct.run(
      sub.id,
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
    console.log("  +", p.cardboardname, "|", sub.cardboardname);

    const reviews = REVIEWS_BY_PRODUCT[reviewIndex] || [];
    reviewIndex++;
    reviews.forEach((r, j) => {
      const createdAt = REVIEW_DATES[dateIndex + j] || REVIEW_DATES[j % REVIEW_DATES.length];
      insertReview.run(productId, r.authorName, r.rating, r.comment, createdAt);
    });
    dateIndex = (dateIndex + reviews.length) % REVIEW_DATES.length;
  }
}

db.close();
console.log("\nDone. Seeded Food and Restaurant products. Restart dev server and refresh.");
