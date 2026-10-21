/**
 * Seed Food Packaging Box subcategory: rename from "Food Box" if needed, set image to product_c_2_1.png,
 * and add Egg Box 6 & 12 Piece plus Family Grill Box.
 * Run from project root: node scripts/seed-food-packaging-products.js
 * Run after seed-categories and seed-food-restaurant-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const products = [
  {
    cardboardname: "Egg Box | 6 Piece",
    description:
      "Ideal for smaller households, this six piece small egg box offers practical and secure egg storage. Its compact size fits easily into your fridge, perfect for individuals or small families. Individual compartments keep eggs safe and secure.",
    description_long: `Our 6 piece small egg box is designed to meet the needs of small shop owners and marts. Whether you're a single, a couple, or a small family, this egg container offers the right solution for your egg storage requirements. Its compact size fits easily into your refrigerator, optimizing space without compromising on functionality.

We understand the importance of protecting your eggs. Our six piece egg box is equipped with individual slots to safeguard each egg from breaking. The resilient construction, combined with the secure fit of each egg, ensures that they remain intact during transportation, storage, and daily use.

We are committed to environmental responsibility. Our six piece small egg box is made from high quality materials, making it an eco conscious choice for your store. By choosing our product, you contribute to reducing waste and lessening your carbon footprint. Experience the satisfaction of making a sustainable choice without compromising on quality or functionality.`,
    dimensions: { length: 5.7, width: 3.6, depth: 2.5 },
    rate: 100,
    minOrder: 5,
    quantity: 100,
    sku: "FB-EGG6",
    price_tiers: [
      { pcs: 5, price: 100 },
      { pcs: 10, price: 200 },
      { pcs: 25, price: 480 },
      { pcs: 50, price: 900 },
      { pcs: 100, price: 1750 },
    ],
    features: [
      "Built in separation for eggs to prevent collision",
      "3 PLY Corrugated Kraft board, brown color",
      "Ideal for retailers, shop owners, marts and supermarkets",
      "Compact size for refrigerator storage",
    ],
    images: ["/products/product_c_2_1.png", "/products/product_c_2_2.png"],
  },
  {
    cardboardname: "Egg Box | 12 Piece",
    description:
      "Keep your eggs safe with our robust and eco friendly 12 piece egg box. Designed with care, our egg box keeps each egg safely in place, reducing breakage and preserving freshness. Made from high quality, recyclable materials.",
    description_long: `We bring the ultimate solution for keeping your farm fresh eggs safe with our 12 piece egg box. Made from sturdy, food grade cardboard, each box is crafted to protect eggs from breakage while preserving their freshness. With twelve individual slots, our egg box ensures eggs stay securely in place during transit and storage. The precise sizing of each compartment reduces movement, providing easy access and handling.

We prioritize sustainability. Our 12 piece egg box is made from recyclable materials, reducing environmental impact without compromising on quality or performance. Choose an eco friendly option that aligns with your values.

Ideal for farmers, retailers, and customers alike, our egg box is built for fetching, storing, and displaying eggs. Its thoughtful design and customizable branding options make it perfect for shop owners, grocery stores, and marts. Each box meets the highest standards of quality and reliability, from its sturdy construction to its secure closure. Customize your egg boxes with your company logo or label to market your farm fresh eggs effectively.`,
    dimensions: { length: 11.4, width: 3.6, depth: 2.5 },
    rate: 150,
    minOrder: 5,
    quantity: 100,
    sku: "FB-EGG12",
    price_tiers: [
      { pcs: 5, price: 150 },
      { pcs: 10, price: 300 },
      { pcs: 25, price: 700 },
      { pcs: 50, price: 1300 },
      { pcs: 100, price: 2500 },
    ],
    features: [
      "Built in separation for eggs to prevent collision",
      "3 PLY Corrugated Kraft board, brown color",
      "Ideal for retailers, shop owners, and marts",
      "Twelve individual slots for maximum protection",
    ],
    images: ["/products/product_c_3_1.png", "/products/product_c_3_2.png"],
  },
  {
    cardboardname: "Family Grill Box",
    description:
      "Sturdy family grill box made from solid paper board. Keeps food fresh and secure on the go. Roomy design for family meals, picnics and barbecues. Easy to use with secure closure.",
    description_long: `Our Family Grill Box is a practical packaging solution for family meals and outdoor occasions. It is made to hold a variety of foods, from burgers and hot dogs to breaded chicken and ribs.

Made from solid paper board, the Family Grill Box is strong and reliable so your food stays fresh and secure during travel. The roomy design lets you pack enough for the whole family, making it a handy choice for picnics, barbecues and other outdoor activities.

The design is simple and efficient. The box is easy to use so you can pack your food quickly. The secure closure keeps your food in place so you can focus on enjoying time with family and friends.

Our Family Grill Box is also adaptable. You can add your branding or customise the box to suit your needs. Whether you want to add a logo or a special message for your customers, the box works well for showcasing your designs.

We focus on quality packaging for your products. Our Family Grill Box is made to meet high standards of safety and hygiene. When you choose us for your food packaging needs, you can be confident you are getting a product that is reliable and safe for your food business.`,
    dimensions: { length: 11, width: 11, depth: 4 },
    rate: 400,
    minOrder: 5,
    quantity: 200,
    sku: "FB-GRILL-FAM",
    price_tiers: [
      { pcs: 5, price: 400 },
      { pcs: 10, price: 780 },
      { pcs: 25, price: 1900 },
      { pcs: 50, price: 3750 },
    ],
    features: [
      "11 x 11 x 4 inch, brown",
      "3 PLY corrugated kraft board",
      "Roomy design for family meals",
      "Ideal for picnics, barbecues and outdoor use",
    ],
    images: ["/products/product_f_1_1.jpg", "/products/product_f_1_2.jpg"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Bushra Khan", rating: 5, comment: "Perfect for our small shop. Eggs stay safe." },
    { authorName: "Junaid Malik", rating: 5, comment: "Compact and sturdy. Good value." },
    { authorName: "Sana Parveen", rating: 5, comment: "Ideal for fridge storage. No breakage." },
    { authorName: "Rizwan Hussain", rating: 5, comment: "We use for retail. Customers like it." },
    { authorName: "Zara Ali", rating: 5, comment: "Eco friendly and reliable. Will reorder." },
  ],
  [
    { authorName: "Asad Iqbal", rating: 5, comment: "Best 12 piece egg box we have used." },
    { authorName: "Hira Noor", rating: 5, comment: "Great for our mart. Sturdy and presentable." },
    { authorName: "Salman Rashid", rating: 5, comment: "Food grade and recyclable. Very satisfied." },
    { authorName: "Lubna Ahmed", rating: 5, comment: "Slots hold eggs firmly. Good for retailers." },
    { authorName: "Hamza Choudhry", rating: 5, comment: "Durable and reliable. Ordering in bulk." },
  ],
  [
    { authorName: "Rashid Ali", rating: 5, comment: "Perfect for our family barbecues. Sturdy and roomy." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Food stays fresh. Great for picnics." },
    { authorName: "Usman Khan", rating: 5, comment: "Easy to pack and close. Good quality." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "We use for outdoor events. No leaks." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Handy size for family meals. Will reorder." },
  ],
];

const reviewDates = [
  "2024-06-15 10:00:00", "2024-09-22 14:30:00", "2024-12-10 09:15:00", "2025-03-08 11:45:00", "2025-06-20 16:00:00",
  "2024-07-08 08:30:00", "2024-10-18 13:00:00", "2025-01-12 10:20:00", "2025-04-15 15:30:00", "2025-07-10 09:00:00",
  "2024-08-12 11:00:00", "2024-11-05 14:00:00", "2025-02-20 09:30:00", "2025-05-18 16:00:00", "2025-08-08 10:45:00",
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories/subcategories first.");
  process.exit(1);
}

const db = new Database(dbPath);

let catRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ? AND parent_id IS NOT NULL").get("Food Packaging Box");
if (!catRow) {
  catRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ? AND parent_id IS NOT NULL").get("Food Box");
  if (catRow) {
    db.prepare("UPDATE categories SET cardboardname = ?, img = ? WHERE id = ?").run(
      "Food Packaging Box",
      JSON.stringify(["/products/product_c_2_1.png"]),
      catRow.id
    );
    console.log("  Renamed 'Food Box' to 'Food Packaging Box' and set image to product_c_2_1.png");
  }
}
if (!catRow) {
  console.error("Subcategory 'Food Packaging Box' or 'Food Box' not found. Run seed-food-restaurant-subcategories.js first.");
  db.close();
  process.exit(1);
}

const categoryId = catRow.id;

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_c_2_1.png"]), categoryId);
console.log("  Set Food Packaging Box subcategory image to product_c_2_1.png");

db.prepare("DELETE FROM product_reviews WHERE productId IN (SELECT id FROM products WHERE mainType = ?)").run(categoryId);
db.prepare("DELETE FROM products WHERE mainType = ?").run(categoryId);

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
console.log("\nDone. Seeded 3 Food Packaging Box products (Egg Box 6 & 12 Piece, Family Grill Box) and set subcategory image. Restart dev server and refresh.");
