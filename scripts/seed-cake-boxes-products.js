/**
 * Seed Cake Boxes subcategory with 3 products. Sets subcategory image to product_ca_2_1.jpg.
 * Run from project root: node scripts/seed-cake-boxes-products.js
 * Run after seed-categories and seed-food-restaurant-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Cake Boxes";

const products = [
  {
    cardboardname: "Cake Box 1 Pound",
    description:
      "One pound cake box. Sturdy, durable bakery boxes made from eco friendly kraft board. Flat and creased for easy assembly. Ideal for cookies, brownies, tarts, biscuits, croissants and more. Adaptable size for home and professional bakers.",
    description_long: `Our 1 pound cake box is a practical solution for packaging and presenting your cakes. Whether you are a professional baker or a home enthusiast, these boxes are designed to meet your needs.

Made from strong, durable corrugated board, the 1 pound cake box keeps your cakes well protected during delivery and storage. The secure cover keeps your cake fresh and helps prevent damage.

The clean, simple design adds a professional touch to your cakes, making them suitable for gifts or special occasions. The box is also customizable so you can add your own branding or details for a unique look.

Our 1 pound cake boxes are easy to assemble and use, so they suit busy bakers. Fold along the pre-scored lines, tuck in the flaps, and the box is ready.

Whether you sell cakes at a bakery, at a market, or online, this cake box is a reliable packaging option. It is also useful for storing leftover cake at home and keeping it fresh longer.`,
    dimensions: { length: 10.25, width: 9.75, depth: 2.5 },
    rate: 330,
    minOrder: 5,
    quantity: 500,
    sku: "FB-CAKE-1LB",
    price_tiers: [
      { pcs: 5, price: 330 },
      { pcs: 10, price: 660 },
      { pcs: 25, price: 1650 },
      { pcs: 50, price: 3300 },
    ],
    features: [
      "10.25 x 9.75 x 2.5 inch, brown",
      "3 PLY corrugated kraft board",
      "Flat and creased for easy assembly",
      "Ideal for cookies, brownies, tarts, biscuits, croissants",
    ],
    images: ["/products/product_ca_1_1.jpg", "/products/product_ca_1_2.jpg"],
  },
  {
    cardboardname: "Cake Box | Heightened 10″ x 10″ x 10″",
    description:
      "Cake box packaging with 10 inch height. Sturdy, eco friendly kraft board. Flat and creased for easy assembly. Ideal for cakes, cookies, brownies, tarts and more. Adaptable size for home and professional bakers.",
    description_long: `Our cake box packaging in 10 x 10 x 10 inch dimensions is a practical way to present your baked goods. The generous size suits standard cakes and other treats.

Made from quality materials, the box keeps your cakes safe and secure in transit. The sturdy construction provides stability and helps protect against knocks or damage during delivery.

The neat, refined look improves your presentation, so it works well for bakeries, special events and celebrations. The clean finish leaves room for personalisation so you can add your branding or a custom touch.

You can assemble the cake box quickly and easily. The secure closure keeps your cakes safe until they reach their destination. The size and shape make storage and transport convenient for bakers and pastry chefs.

Whether you are a home baker displaying your creations or a professional impressing customers, this cake box meets a range of packaging needs with its mix of durability, function and design.`,
    dimensions: { length: 10, width: 10, depth: 10 },
    rate: 430,
    minOrder: 5,
    quantity: 500,
    sku: "FB-CAKE-1010",
    price_tiers: [
      { pcs: 5, price: 430 },
      { pcs: 10, price: 850 },
      { pcs: 15, price: 1260 },
      { pcs: 20, price: 1660 },
      { pcs: 50, price: 4100 },
    ],
    features: [
      "10 x 10 x 10 inch (height), brown",
      "3 PLY outer kraft and inner kraft liner",
      "Easy to assemble, secure closure",
      "Suitable for bakeries and events",
    ],
    images: ["/products/product_ca_2_1.jpg", "/products/product_ca_2_2.jpg"],
  },
  {
    cardboardname: "Big Size Cake Box",
    description:
      "Large cake box packaging. Sturdy, eco friendly kraft board. Flat and creased for easy assembly. Ideal for cookies, brownies, tarts, biscuits, croissants and more. Essential for home and professional bakers.",
    description_long: `Have you ever baked a delicious cake, a real treat in flavour and taste, only for it to lose its appeal in transit? We understand how important it is for cakes to arrive in great condition, especially for the moments you share with family and friends. Our big size cake boxes are designed to protect your creations and make a strong impression.

We know that cakes come in all shapes and sizes. Whether you are a professional baker or a home chef, our big cake boxes offer plenty of space for your most impressive work. Made from quality cardboard, these boxes are strong enough to protect even delicate cakes so they reach their destination looking as good as when they left your kitchen.

Our big cake box is more than just packaging. We believe presentation matters, and our boxes are designed to showcase your cake and add a touch of elegance to any occasion. The box can become part of the gift itself, adding to the anticipation.

Our big cake boxes suit many occasions: birthday celebrations, weddings and anniversaries, or any time you want a cake to arrive safely and look stunning. We focus on helping your baking stand out, so your creations arrive in one piece and make every slice a celebration.`,
    dimensions: { length: 9, width: 9, depth: 4 },
    rate: 87,
    minOrder: 1,
    quantity: 500,
    sku: "FB-CAKE-BIG",
    price_tiers: [
      { pcs: 1, price: 87 },
      { pcs: 2, price: 174 },
      { pcs: 5, price: 435 },
      { pcs: 10, price: 870 },
      { pcs: 20, price: 1740 },
      { pcs: 50, price: 4350 },
    ],
    features: [
      "9 x 9 x 4 inch (height), brown",
      "3 PLY corrugated kraft board",
      "Large size for big cakes",
      "Suitable for birthdays, weddings, events",
    ],
    images: ["/products/product_ca_3_1.jpg", "/products/product_ca_3_2.jpg"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Zara Ahmed", rating: 5, comment: "Perfect for 1 lb cakes. Sturdy and easy to fold." },
    { authorName: "Bilal Noor", rating: 5, comment: "We use these for brownies and cookies. Great value." },
    { authorName: "Hina Malik", rating: 5, comment: "Clean look. Customers like the presentation." },
    { authorName: "Waqas Choudhry", rating: 5, comment: "Assembly is quick. No damage in delivery." },
    { authorName: "Sadia Farooq", rating: 5, comment: "Ideal for our bakery. Will reorder." },
  ],
  [
    { authorName: "Rashid Ali", rating: 5, comment: "10 inch height fits our tiered cakes. Very good." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Strong and presentable. Happy with quality." },
    { authorName: "Usman Khan", rating: 5, comment: "Easy to close and stack. Recommended." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "We use for events. Cakes arrive safe." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Good size and finish. No complaints." },
  ],
  [
    { authorName: "Saima Riaz", rating: 5, comment: "Big box for birthday cakes. Does the job well." },
    { authorName: "Haris Mahmood", rating: 5, comment: "Wedding cakes fit nicely. Sturdy material." },
    { authorName: "Lubna Ahmed", rating: 5, comment: "Best large cake box we have used. Reordering." },
    { authorName: "Asad Iqbal", rating: 5, comment: "Cake arrived in perfect condition. Thank you." },
    { authorName: "Zeeshan Malik", rating: 5, comment: "Great for home bakers and small bakeries." },
  ],
];

const reviewDates = [
  "2024-05-12 10:00:00", "2024-08-20 14:30:00", "2024-11-08 09:15:00", "2025-02-15 11:45:00", "2025-05-28 16:00:00",
  "2024-06-18 08:30:00", "2024-09-10 13:00:00", "2024-12-22 10:20:00", "2025-03-18 15:30:00", "2025-06-10 09:00:00",
  "2024-07-05 11:00:00", "2024-10-14 14:00:00", "2025-01-25 08:45:00", "2025-04-20 12:00:00", "2025-07-15 10:30:00",
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

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_ca_2_1.jpg"]), categoryId);
console.log("  Updated Cake Boxes subcategory image to product_ca_2_1.jpg");

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
console.log("\nDone. Seeded 3 Cake Boxes products and set subcategory image. Restart dev server and refresh.");
