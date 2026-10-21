/**
 * Seed Gift Boxes subcategory with 4 products. Sets subcategory image to product_e_6_1.jpg.
 * Run from project root: node scripts/seed-gift-boxes-products.js
 * Run after seed-categories and seed-corrugated-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Gift Boxes";

const products = [
  {
    cardboardname: "Gift Box",
    description:
      "Gift packing boxes that turn ordinary gifts into extraordinary presents. Prime quality cardboard in a variety of sizes and colors. Ideal for jewelry, toys and larger gifts. Customizable with ribbons and tags.",
    description_long: `A gift packing box can turn ordinary gifts into extraordinary presents. Made from prime quality cardboard, these sturdy gift boxes come in a variety of sizes and colors and are ready to showcase any present.

From small ornaments to large items, we have a box to match your gift. Browse our range of classic squares and rectangles. No matter what you are gifting, there is a gift box ready to make it shine. Our packing box comes in a range of custom patterns. Add a touch of personality to your gift or pick a timeless design for a touch of sophistication. The sturdy cardboard construction ensures your present arrives securely and looking just as good as it feels.

Our gift boxes are a blank canvas for creative expression. Dress them up with ribbons, tags, or personal messages. Let your creativity run wild and create a gift presentation that reflects your thought and style. Our boxes help turn giving into a memorable experience. They are a great way to show someone you care, add a touch of magic to any event, and create memories that last.`,
    dimensions: { length: 6.5, width: 6.5, depth: 4 },
    rate: 365,
    minOrder: 5,
    quantity: 500,
    sku: "GIFT-BOX",
    price_tiers: [
      { pcs: 5, price: 365 },
      { pcs: 10, price: 730 },
      { pcs: 25, price: 1825 },
      { pcs: 50, price: 3650 },
    ],
    features: [
      "6.5 x 6.5 x 4 inch, brown 3 ply corrugated kraft board",
      "Ideal for jewelry, toys, big gifts",
      "Variety of sizes and colors",
      "Personalize with ribbons and tags",
    ],
    images: ["/products/product_e_6_1.jpg", "/products/product_e_6_2.jpg"],
  },
  {
    cardboardname: "Mug Box",
    description:
      "Custom gift boxes for mugs and cups. Strong cardboard in a range of sizes. Perfect for birthday items, chocolates, accessories and jewellery. Easy to assemble and stack.",
    description_long: `Our mug boxes are more than just packaging. They are a thoughtful way to protect and present your favorite mugs. Made from sturdy cardboard, these corporate gift boxes come in a range of sizes and shapes and are ready to keep your mugs in style.

From classic coffee mugs to travel mugs, we have you covered. Browse our collection of square and luxury box options to find the right size for your mug. No matter what mug needs a cozy home, there is a mug box waiting for it. These birthday gift boxes go beyond basic protection. Choose from playful sizes to add a touch of personalization to your gift. The sturdy cardboard keeps your mug safe and secure during storage.

Our luxury mug boxes enhance the gifting experience. Present a mug filled with treats or confectionery in a beautiful birthday gift box to create a thoughtful and precious gift. Personalize it with stickers, bows, or sticky notes to add a unique touch. Our mug boxes are also ideal for keeping your mugs in place and dust-free at home. Store seasonal mugs in these boxes or keep your everyday collection neatly on a shelf.`,
    dimensions: { length: 4.5, width: 4.5, depth: 6 },
    rate: 200,
    minOrder: 5,
    quantity: 500,
    sku: "GIFT-MUG",
    price_tiers: [
      { pcs: 5, price: 200 },
      { pcs: 10, price: 400 },
      { pcs: 25, price: 1000 },
      { pcs: 50, price: 2000 },
      { pcs: 100, price: 4000 },
    ],
    features: [
      "4.5 x 4.5 x 6 inch, brown 3 PLY (KL 150 x 2 + SF 120 x 1)",
      "Ideal for mugs, birthday items, chocolates, accessories",
      "Strong and easy to assemble",
      "Customizable for gifting",
    ],
    images: ["/products/product_e_7_1.jpg", "/products/product_e_7_2.jpg"],
  },
  {
    cardboardname: "Jewellery Box",
    description:
      "Small product box made from durable, eco friendly materials. Exceptional protection for delicate items. Ideal for jewelry, cosmetics and small treasures. Sleek, customizable design. Self assembling lock system.",
    description_long: `Your items deserve a high level of care. Our small product box is made from robust, quality materials that protect your products from dust, moisture, and physical impact so they stay in original condition whether stored or dispatched.

Make a lasting impression with our product box, which combines function with a clean look. The box has a modern, neat design that adds a touch of refinement to any item. Available in a variety of finishes and colors, it can be customized to reflect your brand or personal style.

From fine jewelry and cosmetics to tech accessories and small gifts, our small product box is versatile enough for a wide range of items. Its compact size is ideal for organizing inventory or presenting gifts with a touch of class. The box is designed for easy assembly with pre-scored lines and straightforward instructions. Our box is made from eco friendly, recyclable materials. You can personalize it with your logo, brand colors, or unique design to create a strong marketing tool and a consistent brand experience from the moment the product is delivered.`,
    dimensions: { length: 10.2, width: 5.5, depth: 2 },
    rate: 280,
    minOrder: 5,
    quantity: 500,
    sku: "GIFT-JEWEL",
    price_tiers: [
      { pcs: 5, price: 280 },
      { pcs: 10, price: 560 },
      { pcs: 25, price: 1350 },
      { pcs: 50, price: 2600 },
      { pcs: 100, price: 4800 },
    ],
    features: [
      "10.2 x 5.5 x 2 inch, volumetric weight 0.35 KG",
      "3 PLY (Kraft 120 + SF 120 + KL 120), self assembling lock",
      "Ideal for jewelry, cosmetics, small treasures",
      "Custom branding available",
    ],
    images: ["/products/product_e_3_1.jpg", "/products/product_e_3_2.jpg"],
  },
  {
    cardboardname: "Medium Gift Box",
    description:
      "Medium gift box for fine jewelry, chocolates, or keepsakes. Browse our collection to find the perfect fit. No matter what small surprise needs a cozy home. Sturdy cardboard in a variety of patterns.",
    description_long: `Our medium gift box opens up a world of possibilities in a compact package. Made from sturdy cardboard, these firm containers come in a range of sizes and are ready to hold your little surprises.

Whether you are looking for the right box for fine jewelry, delicious chocolates, or fond keepsakes, we have the answer. Browse our collection of packing items to find the perfect fit. No matter what tiny surprise needs a cozy home, our medium gift box is waiting to make it gleam.

Medium does not have to mean plain. Our medium gift boxes come in a vibrant range of elegant patterns. Add a touch of personality to your gift or choose a timeless design for a touch of refinement. The sturdy cardboard construction ensures your contents arrive safely and look just as good as they feel.

Our packaging boxes are a blank canvas for your creativity. Dress them up with ribbons, tags, or personal messages. Use them to craft beautiful gift packages, organize craft supplies, store buttons and beads, or hide little presents for someone special. The possibilities are endless.

We help you turn small gestures into big moments. They are a great way to show someone you care, add a touch of excitement to any celebration, and create memories that last. They are also handy for keeping your belongings organized and accessible.`,
    dimensions: { length: 5, width: 3.5, depth: 2.5 },
    rate: 250,
    minOrder: 5,
    quantity: 500,
    sku: "GIFT-MEDIUM",
    price_tiers: [
      { pcs: 5, price: 250 },
      { pcs: 10, price: 470 },
      { pcs: 25, price: 1150 },
      { pcs: 50, price: 2250 },
    ],
    features: [
      "5 x 3.5 x 2.5 inch, brown 3 PLY corrugated kraft board",
      "Ideal for hair catcher, candies, necklace, small gifts",
      "Variety of patterns, customizable with ribbons and tags",
      "Sturdy construction for safe delivery",
    ],
    images: ["/products/product_g_1_1.jpg", "/products/product_g_1_2.png"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Farhan Akhtar", rating: 5, comment: "Gift boxes look elegant. Customers love the presentation." },
    { authorName: "Saima Riaz", rating: 5, comment: "Variety of sizes for jewelry and toys. Great quality." },
    { authorName: "Waqas Ahmed", rating: 5, comment: "Ribbons and tags make gifting special. Will reorder." },
    { authorName: "Amina Sheikh", rating: 5, comment: "Sturdy and presentable. Perfect for our store." },
    { authorName: "Haris Mahmood", rating: 5, comment: "Blank canvas for personalization. Very pleased." },
  ],
  [
    { authorName: "Nabeel Khan", rating: 5, comment: "Mug boxes are cute and strong. Great for gifting." },
    { authorName: "Samina Abbas", rating: 5, comment: "Fits coffee mugs perfectly. Easy to assemble." },
    { authorName: "Kashif Mehmood", rating: 5, comment: "Using for birthday and corporate gifts. Love them." },
    { authorName: "Sadia Farooq", rating: 5, comment: "Stack well for storage. Good value in bulk." },
    { authorName: "Tahir Malik", rating: 5, comment: "Best mug packaging we have found. Recommended." },
  ],
  [
    { authorName: "Samina Abbas", rating: 5, comment: "Perfect for jewelry and cosmetics. Sleek and customizable." },
    { authorName: "Kashif Mehmood", rating: 5, comment: "Self assembling lock is handy. Quick to set up." },
    { authorName: "Nida Hassan", rating: 5, comment: "Small but sturdy. Great for small treasures and gifts." },
    { authorName: "Arsalan Khan", rating: 5, comment: "Eco friendly and good quality. Branding looked sharp." },
    { authorName: "Saba Riaz", rating: 5, comment: "Ideal for jewellery gifting. Will order again." },
  ],
  [
    { authorName: "Rashid Ali", rating: 5, comment: "Perfect size for chocolates and necklaces. Sturdy and presentable." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Medium gift box fits small keepsakes perfectly. Great quality." },
    { authorName: "Usman Khan", rating: 5, comment: "Using for candies and hair accessories. Customers love them." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "Blank canvas for ribbons and tags. Will reorder." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Best medium gift box we have used. Recommended." },
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

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_e_6_1.jpg"]), categoryId);
console.log("  Updated Gift Boxes subcategory image to product_e_6_1.jpg");

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
console.log("\nDone. Seeded 4 Gift Boxes products and set subcategory image. Restart dev server and refresh.");
