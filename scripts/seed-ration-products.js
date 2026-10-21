/**
 * Seed ration category with 4 actual products and reviews.
 * Run from project root: node scripts/seed-ration-products.js
 * Run seed:categories first so "Ration Packaging Boxes" exists.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const RATION_CATEGORY_NAME = "Ration Packaging Boxes";

const products = [
  {
    cardboardname: "Ration Packaging Box 18″ (18×12×12 In)",
    description:
      "Use this popular size ration packaging and carton boxes to organize your grocery including dates, rice, oil, dal, Rooh Afza, ketchup, chili powder, chaat masala and more. Ideal for gift packaging, packing cartons, mailer box, kraft boxes and cake boxes.",
    description_long: `Our adaptable and reliable Cardboard Boxes and Ration Packaging Box 18″ are designed to meet all your packaging needs. Whether you're packing, storing, or shipping goods, these boxes provide the endurance and protection necessary for safe transport.

They are custom made from high quality materials, so they can withstand the rigors of handling and transportation. The sturdy construction makes them suitable for packing a variety of items, from household goods to industrial products.

The spacious 18″ design offers ample room for packing a large quantity of goods, making them perfect for commercial use. The boxes are easy to assemble, allowing you to pack your items quickly and efficiently. Their compact size also makes them easy to stack and store, helping you save space in your storage area.

Our boxes are designed with your convenience in mind. They are hygienic and food safe, ensuring that your food items remain fresh and uncontaminated during storage and transit. They are made from renewable materials, making them an eco friendly choice for your packaging needs.

Whether you're packing food items, household goods, or industrial products, these boxes are a reliable solution. Their tough construction, spacious design, and secure closures ensure that your items are well protected during carriage and that your goods arrive at their destination in original condition.`,
    dimensions: { length: 18, width: 12, depth: 12 },
    rate: 265,
    minOrder: 1,
    quantity: 100,
    sku: "RPB-18-1212",
    price_tiers: JSON.stringify([
      { pcs: 1, price: 265 },
      { pcs: 2, price: 530 },
      { pcs: 5, price: 1325 },
    ]),
    features: JSON.stringify([
      "Safely transfer your products in this large, sturdy box from one place to another without damage.",
      "Holds 15–20 kg weight",
      "Durable and reusable",
      "Protects irregular loads",
      "Material: 5 ply (Corrugated Kraft Board)",
    ]),
    images: JSON.stringify(["/products/product_1_1.jpg", "/products/product_1_2.jpg"]),
    deliveryNote: "Additional delivery charges will be applied for more than 5 pieces, which will be communicated after order confirmation.",
  },
  {
    cardboardname: "Ration Packaging Box 18″ (18×18×14 In)",
    description:
      "A reliable companion for outdoor use and emergency preparedness. Crafted from high quality materials, this carton is built to withstand rugged conditions, ensuring your food rations stay safe and secure. Generous capacity for meals, snacks and essentials.",
    description_long: `This Ration Packaging Box 18″ is not just a box; it's a reliable companion for your outdoor adventures and emergency preparedness. Crafted from high quality materials, this carton box is built to withstand rugged conditions, ensuring your food rations stay safe and secure. With a generous capacity, it offers ample space for storing meals, snacks, and other essentials, keeping them organized and easily accessible. The box's sturdy construction and secure closure make it ideal for use in various environments, from camping and hiking to disaster relief efforts.

We use only fine materials to craft our boxes, so they can withstand the rigors of transportation and handling. Whether you're shipping delicate electronics or heavy duty machinery, our boxes provide the strength and resilience needed to keep your products safe.

Our boxes are designed to last. You can reuse them multiple times without compromising their integrity. This not only saves you money in the long run but also reduces waste, making our boxes an eco friendly choice.

Our commitment to providing high quality and durable packaging solutions is clear. We understand the importance of ensuring that your products reach their destination safely and in pristine condition. Our boxes are crafted using the finest materials available, ensuring that they can withstand the toughest conditions. What sets our packaging boxes apart is their unique combination of strength and versatility. They are designed to be lightweight and easy to handle, making them ideal for a wide range of applications. When you choose our packaging boxes, you're choosing peace of mind.`,
    dimensions: { length: 18, width: 18, depth: 14 },
    rate: 380,
    minOrder: 1,
    quantity: 100,
    sku: "RPB-18-1814",
    price_tiers: JSON.stringify([
      { pcs: 1, price: 380 },
      { pcs: 2, price: 760 },
      { pcs: 5, price: 1900 },
    ]),
    features: JSON.stringify([
      "Safely transfer your products in this large, sturdy box without damage.",
      "Holds 30–35 kg weight",
      "Durable and reusable",
      "Protects irregular loads",
      "Material: 5 ply (Corrugated Kraft Board)",
    ]),
    images: JSON.stringify(["/products/product_2_1.jpg", "/products/product_2_2.png"]),
    deliveryNote: "Additional delivery charges will be applied for more than 5 pieces, which will be communicated after order confirmation.",
  },
  {
    cardboardname: "Ration Packaging Box 16″ (16×10×9 In)",
    description:
      "Durable and reliable ration packaging box crafted for your packing ease. This 16″ carton is ideal for storing and moving various food items, ensuring they remain fresh and protected. Curated from high quality materials, sturdy enough for handling and transportation.",
    description_long: `Our durable and reliable Ration Packaging Box is crafted for your packing ease. This 16″ carton is ideal for storing and moving various food items, ensuring they remain fresh and protected. Made from high quality materials, these cartons for packing are sturdy enough to withstand the toughness of handling and transportation, giving you peace of mind knowing your products are secure.

With a capacious design, our Ration Packaging Box offers large room for packing a variety of food items, making it perfect for use in commercial kitchens, food delivery services and warehouses. The box is easy to assemble, allowing you to pack your items quickly and effectively. Its compact size makes it easy to stack and store, helping you save valuable space in your storage area.

Our Ration Packaging Box is built to meet the highest standards of quality and safety. It is hygienic and food safe, ensuring that your food items remain fresh during storage and carriage. The box is also eco friendly, made from recyclable materials.

Whether you're packing dry goods, canned foods, or other food items, our Cartons for Packing Box is a reliable solution. Its strong construction, spacious design, and food safe properties make it a dependable choice for all your packing needs. Designed with your convenience in mind, our Ration Packaging Box is the perfect choice for food retailers, catering services, or household needs.`,
    dimensions: { length: 16, width: 10, depth: 9 },
    rate: 210,
    minOrder: 1,
    quantity: 100,
    sku: "RPB-16-1009",
    price_tiers: JSON.stringify([
      { pcs: 1, price: 210 },
      { pcs: 2, price: 420 },
      { pcs: 5, price: 1050 },
    ]),
    features: JSON.stringify([
      "Safely transfer your products in this large, sturdy box without damage.",
      "Holds 10–15 kg weight",
      "Durable and reusable",
      "Protects irregular loads",
      "Material: 5 ply (Corrugated Kraft Board)",
    ]),
    images: JSON.stringify(["/products/product_3_1.jpg", "/products/product_3_2.png"]),
    deliveryNote: "Additional delivery charges will be applied for more than 5 pieces, which will be communicated after order confirmation.",
  },
  {
    cardboardname: "Ration Packaging Box 20″ (20×14×12 In)",
    description:
      "Ration Packaging Box sized at 20″, crafted to provide secure and efficient storage for different ration items. Assembled from high quality materials, these packing cartons are durable and strong, assuring the safe distribution of goods.",
    description_long: `Our Ration Packaging Box, sized at 20″, is crafted to provide secure and efficient storage solutions for different ration items. Made from high quality materials, these packing cartons are durable and strong, assuring the safe distribution of goods.

With a spacious interior, our ration packaging box offers ample storage space for a wide range of ration items. The box is designed to accommodate items of varying shapes and sizes, making it versatile and practical for different packaging needs.

Our packing cartons are convenient for packing and shipping operations since they are simple to assemble. The box's robust design guarantees that it will keep its integrity and shape throughout transportation, keeping the contents from damage. The food, pharmaceutical, and consumer goods sectors are just a few of the industries that find great use for the ration packaging box. It can be used for packing and moving a variety of goods because of its solid build and safe layout.

We aim to offer premium packaging boxes that satisfy our clients' various needs. Our ration packaging box is made to offer reliable and affordable packaging options, guaranteeing the safe and secure delivery of your goods. Our 20″ ration packaging box is the ideal option if you need to pack food products, medications, or other ration goods.`,
    dimensions: { length: 20, width: 14, depth: 12 },
    rate: 300,
    minOrder: 1,
    quantity: 100,
    sku: "RPB-20-1412",
    price_tiers: JSON.stringify([
      { pcs: 1, price: 300 },
      { pcs: 2, price: 600 },
      { pcs: 5, price: 1500 },
    ]),
    features: JSON.stringify([
      "Safely transfer your products in this large, sturdy box without damage.",
      "Holds 20–25 kg weight",
      "Durable and reusable",
      "Protects irregular loads",
      "Material: 5 ply (Corrugated Kraft Board)",
    ]),
    images: JSON.stringify(["/products/product_4_1.jpg", "/products/product_4_2.jpg"]),
    deliveryNote: "Additional delivery charges will be applied for more than 5 pieces, which will be communicated after order confirmation.",
  },
];

const reviewsByProduct = [
  [
    { authorName: "Usman Khan", rating: 5, comment: "Best quality, exactly as described. Used for grocery storage and moving. Very sturdy." },
    { authorName: "Wasif Ali", rating: 5, comment: "Nice product. Good thickness and holds weight well." },
    { authorName: "Sana Ahmed", rating: 5, comment: "High quality cartons. Will order again for our shop." },
    { authorName: "Imran Sheikh", rating: 5, comment: "Loved the quality of the cartons. Fast delivery." },
    { authorName: "Fatima Noor", rating: 5, comment: "Perfect for ration distribution. Durable and reliable." },
  ],
  [
    { authorName: "Ali Hassan", rating: 5, comment: "Heavy duty box, ideal for bulk storage. Very satisfied." },
    { authorName: "Zainab Khan", rating: 5, comment: "Strong and spacious. Great for emergency supplies." },
    { authorName: "Omar Farooq", rating: 5, comment: "Excellent build quality. Holds 30 kg without any issue." },
    { authorName: "Ayesha Malik", rating: 5, comment: "Reliable packaging for our relief work. Thank you." },
    { authorName: "Bilal Ahmed", rating: 5, comment: "Best heavy duty ration box we have used. Recommended." },
  ],
  [
    { authorName: "Hina Rashid", rating: 5, comment: "Compact and sturdy. Good for small businesses." },
    { authorName: "Tariq Mahmood", rating: 5, comment: "Perfect size for our kitchen supplies. Good value." },
    { authorName: "Sadia Iqbal", rating: 5, comment: "Clean finish and easy to assemble. Happy with purchase." },
    { authorName: "Faisal Khan", rating: 5, comment: "Quality boxes at a fair price. Will reorder." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Ideal for dates and dry goods. Very pleased." },
  ],
  [
    { authorName: "Kamran Ali", rating: 5, comment: "Spacious and strong. Perfect for 20–25 kg loads." },
    { authorName: "Sara Khan", rating: 5, comment: "Great for wholesale ration packing. Durable material." },
    { authorName: "Rashid Mehmood", rating: 5, comment: "Exactly what we needed. Good service and product." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "High quality and reliable. No complaints." },
    { authorName: "Adnan Choudhry", rating: 5, comment: "Best 20 inch ration box we have found. Recommended." },
  ],
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories first.");
  process.exit(1);
}

const db = new Database(dbPath);

// Ensure product columns exist
try {
  db.exec("ALTER TABLE products ADD COLUMN sku TEXT");
} catch (_) {}
try {
  db.exec("ALTER TABLE products ADD COLUMN price_tiers TEXT");
} catch (_) {}
try {
  db.exec("ALTER TABLE products ADD COLUMN description_long TEXT");
} catch (_) {}
try {
  db.exec("ALTER TABLE products ADD COLUMN features TEXT DEFAULT '[]'");
} catch (_) {}

// Resolve Ration category id by name (required for foreign key)
const catRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ?").get(RATION_CATEGORY_NAME);
if (!catRow) {
  console.error(
    "Category '" + RATION_CATEGORY_NAME + "' not found. Run 'npm run seed:categories' first, then run this script again."
  );
  db.close();
  process.exit(1);
}
const RATION_MAIN_TYPE = catRow.id;
console.log("Using category id", RATION_MAIN_TYPE, "for", RATION_CATEGORY_NAME);

// Delete existing ration products so we can re-seed cleanly
db.prepare("DELETE FROM product_reviews WHERE productId IN (SELECT id FROM products WHERE mainType = ?)").run(RATION_MAIN_TYPE);
db.prepare("DELETE FROM products WHERE mainType = ?").run(RATION_MAIN_TYPE);

const insertProduct = db.prepare(`
  INSERT INTO products (mainType, cardboardname, description, rate, quantity, minOrder, dimensions, images, sku, price_tiers, description_long, features)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertReview = db.prepare(`
  INSERT INTO product_reviews (productId, authorName, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?)
`);

// Varied review dates from 2024 to 2026 (one per review, 5 per product)
const reviewDates = [
  "2024-02-15 10:30:00", "2024-06-22 14:00:00", "2025-01-08 09:15:00", "2025-08-19 11:45:00", "2026-02-03 16:20:00",
  "2024-03-10 08:00:00", "2024-09-05 13:30:00", "2025-04-12 10:00:00", "2025-11-20 15:45:00", "2026-01-14 09:00:00",
  "2024-05-18 11:00:00", "2024-12-01 14:30:00", "2025-02-28 08:45:00", "2025-07-07 12:00:00", "2026-03-02 10:30:00",
  "2024-01-25 09:30:00", "2024-10-12 16:00:00", "2025-05-30 11:15:00", "2025-12-15 13:00:00", "2026-02-18 08:00:00",
];

const productIds = [];
for (const p of products) {
  const { deliveryNote, ...rest } = p;
  const dims = rest.dimensions;
  insertProduct.run(
    RATION_MAIN_TYPE,
    rest.cardboardname,
    rest.description,
    rest.rate,
    rest.quantity,
    rest.minOrder,
    JSON.stringify(dims),
    rest.images,
    rest.sku,
    rest.price_tiers,
    rest.description_long,
    rest.features
  );
  productIds.push(db.prepare("SELECT last_insert_rowid() as id").get().id);
  console.log("  +", rest.cardboardname, "| SKU:", rest.sku);
}

for (let i = 0; i < productIds.length; i++) {
  const productId = productIds[i];
  const reviews = reviewsByProduct[i] || [];
  const dateOffset = i * 5;
  reviews.forEach((r, j) => {
    const createdAt = reviewDates[dateOffset + j] || reviewDates[j];
    insertReview.run(productId, r.authorName, r.rating, r.comment, createdAt);
  });
  console.log("  +", reviews.length, "reviews for product", productId);
}

db.close();
console.log("\nDone. Seeded 4 ration products with reviews. Restart dev server and refresh.");
