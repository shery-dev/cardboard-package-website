/**
 * Seed Cube Boxes subcategory with 4 products. Sets subcategory image to product_cu_1_1.png.
 * Run from project root: node scripts/seed-cube-boxes-products.js
 * Run after seed-categories and seed-corrugated-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Cube Boxes";

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
    sku: "CUBE-EGG6",
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
    sku: "CUBE-EGG12",
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
    cardboardname: "Packing Carton Box",
    description:
      "Packing carton box in a range of quality cardboard options. Designed to meet the needs of businesses and individuals. Robust multi-ply construction. Strong protection for storage, transportation and carriage.",
    description_long: `Our packing carton boxes offer a wide range of quality packing cardboard boxes designed to meet the various needs of businesses and individuals. Made from robust, multi-ply cardboard, these boxes provide extra strength and protection for your valuable items during storage, transportation, or carriage.

Our packing carton box comes in a variety of sizes. From compact solutions for small items to large capacity boxes for bulky goods, this range ensures you can find the right fit for your packaging requirements regardless of the size or shape of your items. Whether you are storing documents, shipping merchandise, or organizing your belongings, our packing carton boxes offer a reliable and versatile solution.

We prioritize the safety of your belongings. Our packing carton boxes are made with strong walls and secure closures, including interlocking flaps and optional taping for full protection. This helps your items stay secure and protected from damage during handling, stacking, or carriage. The lightweight design can help minimize shipping costs without compromising on box quality.`,
    dimensions: { length: 10, width: 10, depth: 10 },
    rate: 450,
    minOrder: 5,
    quantity: 500,
    sku: "CUBE-CARTON",
    price_tiers: [
      { pcs: 5, price: 450 },
      { pcs: 10, price: 900 },
      { pcs: 25, price: 2250 },
      { pcs: 50, price: 4500 },
    ],
    features: [
      "10 x 10 x 10 inch, brown corrugated 3 PLY (outer + inner kraft liner)",
      "Multi-ply construction, interlocking flaps",
      "Suitable for documents, merchandise, storage",
      "Lightweight, optional taping",
    ],
    images: ["/products/product_ca_2_1.jpg", "/products/product_ca_2_2.jpg"],
  },
  {
    cardboardname: "Small Cube Box",
    description:
      "Sturdy small boxes in all sizes and shapes. Perfect for gifts, crafts, storage and more. Specially designed for custom mugs and utensils. Quality cardboard in a variety of sizes and colors.",
    description_long: `Our small boxes are made for thoughtful gifting, quick storage, and creative presentation. Made from quality card stock, these small containers come in a variety of sizes and colors and are ready to hold your small items.

From light jewelry to small mugs, find the right small box for your little presents. Small does not have to mean simple. Our small boxes come in a range of sizes and patterns. Add a touch of personality to your gift or choose a timeless design for a touch of class. The sturdy cardboard construction ensures your items arrive safely and look just as good as they feel.

Our small boxes are a blank canvas for your creativity. Dress them up with personal messages. Use them to create beautiful gift packages. Organize craft supplies, or hide little presents for someone special. The possibilities are wide.

These small boxes help you turn small gestures into big moments. They are a great way to show someone you care, add a touch of excitement to any event, and create memories that last. They are also handy for keeping your belongings in place and accessible.`,
    dimensions: { length: 4.5, width: 4.5, depth: 6 },
    rate: 200,
    minOrder: 5,
    quantity: 500,
    sku: "CUBE-SMALL",
    price_tiers: [
      { pcs: 5, price: 200 },
      { pcs: 10, price: 400 },
      { pcs: 25, price: 1000 },
      { pcs: 50, price: 2000 },
      { pcs: 100, price: 4000 },
    ],
    features: [
      "4.5 x 4.5 x 6 inch, brown 3 PLY (KL 150 x 2 + SF 120 x 1)",
      "Ideal for custom mugs and utensils",
      "Perfect for gifts, crafts, and storage",
      "Variety of sizes and patterns",
    ],
    images: ["/products/product_cu_1_1.png", "/products/product_cu_1_2.png"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Bushra Khan", rating: 5, comment: "Compact and secure. Eggs never break in the fridge." },
    { authorName: "Junaid Malik", rating: 5, comment: "Ideal for our small shop. Customers like the presentation." },
    { authorName: "Sana Parveen", rating: 5, comment: "Individual slots work great. Good quality kraft board." },
    { authorName: "Rizwan Hussain", rating: 5, comment: "Eco friendly and sturdy. Perfect for 6 eggs." },
    { authorName: "Zara Ali", rating: 5, comment: "Exactly what we needed for retail. Fast delivery." },
  ],
  [
    { authorName: "Asad Iqbal", rating: 5, comment: "Best 12 piece egg box we have used. No breakage at all." },
    { authorName: "Hira Noor", rating: 5, comment: "Great for our mart. Sturdy and presentable." },
    { authorName: "Salman Rashid", rating: 5, comment: "Food grade and recyclable. Very satisfied." },
    { authorName: "Lubna Ahmed", rating: 5, comment: "Slots hold eggs firmly. Good for farmers and retailers." },
    { authorName: "Hamza Choudhry", rating: 5, comment: "Durable and reliable. Ordering in bulk next time." },
  ],
  [
    { authorName: "Zeeshan Ali", rating: 5, comment: "10x10x10 cube is versatile. Use for storage and shipping." },
    { authorName: "Mariam Ahmed", rating: 5, comment: "Strong multi-ply. Interlocking flaps hold well." },
    { authorName: "Saad Mahmood", rating: 5, comment: "Good for documents and merchandise. Reliable." },
    { authorName: "Hina Farooq", rating: 5, comment: "Lightweight but durable. Fair price in bulk." },
    { authorName: "Umer Rashid", rating: 5, comment: "Packing carton box does the job. Recommended." },
  ],
  [
    { authorName: "Tariq Mahmood", rating: 5, comment: "Perfect for mugs and small gifts. Sturdy and neat." },
    { authorName: "Sana Ahmed", rating: 5, comment: "Small cube size is ideal for crafts and storage." },
    { authorName: "Imran Khan", rating: 5, comment: "Great for utensils and jewelry. Good value." },
    { authorName: "Amina Hassan", rating: 5, comment: "Blank canvas for personalization. Very pleased." },
    { authorName: "Farhan Rashid", rating: 5, comment: "Creates a big effect for small presents. Will reorder." },
  ],
];

const reviewDates = [
  "2024-03-12 10:00:00", "2024-06-20 14:30:00", "2024-09-05 09:15:00", "2025-01-08 11:45:00", "2025-04-22 16:00:00",
  "2024-04-18 08:30:00", "2024-07-10 13:00:00", "2024-10-28 10:20:00", "2025-02-14 15:30:00", "2025-05-10 09:00:00",
  "2024-05-02 11:00:00", "2024-08-15 14:00:00", "2024-11-20 08:45:00", "2025-03-05 12:00:00", "2025-06-18 10:30:00",
  "2024-05-25 09:30:00", "2024-09-12 16:00:00", "2024-12-08 11:15:00", "2025-03-28 14:45:00", "2025-07-02 08:00:00",
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

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_cu_1_1.png"]), categoryId);
console.log("  Updated Cube Boxes subcategory image to product_cu_1_1.png");

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
console.log("\nDone. Seeded 4 Cube Boxes products and set subcategory image. Restart dev server and refresh.");
