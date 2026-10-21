/**
 * Seed Kraft Paper Products category (top-level) and dummy products. Creates the category if missing.
 * Category image: product_k_1_1.jpg
 * Run from project root: node scripts/seed-kraft-paper-products.js
 * Run after seed-categories.js (so DB exists). Can run standalone to add this category.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const CATEGORY_NAME = "Kraft Paper Products";
const CATEGORY_IMAGE = "/products/product_k_1_1.jpg";

const categoryData = {
  cardboardname: CATEGORY_NAME,
  description:
    "Kraft paper bags for takeaway, bakery, cake boxes, and retail. From small cookie bags to large carry bags with twisted rope handles. Food grade options, strong and recyclable. Ideal for restaurants, cafés, bakeries, and shops.",
  description_long:
    "Our kraft paper products range includes takeaway bags, cookie bags, bakery bags, and carry bags with twisted rope handles. Made from strong, unbleached kraft paper in food grade options where needed, they are durable, recyclable, and a practical eco friendly alternative to plastic. Use them for restaurant and café takeaway, bakery and pastry packaging, cake and cupcake box carry bags, or retail and gifting. We offer sizes from compact single portion bags to larger 12 x 10 inch bags so you can match the bag to your product. All bags hold their shape, look clean and professional, and are suitable for businesses that want reliable, sustainable packaging. Order in bulk for better value and keep your packaging consistent and eco friendly.",
  features: [
    "Takeaway bags, cookie bags, bakery bags, and rope handle carry bags",
    "Food grade kraft where needed, strong and recyclable",
    "Sizes for single portions up to large cake boxes and retail",
    "Eco friendly alternative to plastic for restaurants, bakeries, and shops",
  ],
  img: [CATEGORY_IMAGE],
};

const products = [
  {
    cardboardname: "Kraft Takeaway Paper Bags 14\" x 9\" x 5\"",
    description:
      "Sturdy kraft takeaway paper bags for carrying multiple takeaway boxes. Strong, eco friendly alternative for deliveries. 90 gsm brown kraft paper. Ideal for restaurants, cafés, and food delivery.",
    description_long: `Perfect for carrying multiple takeaway boxes, these sturdy paper bags offer a strong, eco friendly alternative for your deliveries. Made from 90 gsm kraft paper, they hold their shape and keep orders secure during transit.

The 14 x 9 x 5 inch size fits several takeaway containers at once, so you can pack combos, family meals, or multiple items in one bag. The brown kraft finish looks clean and professional and is fully recyclable. Use them for restaurant takeaway, café orders, or food delivery. Strong handles and a flat base make the bags easy to carry and stable on the counter.

We keep the design simple and durable so your food arrives in good shape. Order in bulk for better value and keep your delivery packaging consistent and eco friendly.`,
    dimensions: { length: 14, width: 9, depth: 5 },
    rate: 340,
    minOrder: 10,
    quantity: 500,
    sku: "KRAFT-BAG-14",
    price_tiers: [
      { pcs: 10, price: 340 },
      { pcs: 25, price: 850 },
      { pcs: 50, price: 1450 },
      { pcs: 100, price: 2650 },
    ],
    features: [
      "14 x 9 x 5 inch, brown 90 gsm kraft paper",
      "Carries multiple takeaway boxes, strong and sturdy",
      "Eco friendly and recyclable",
      "Ideal for restaurants, cafés, and delivery",
    ],
    images: ["/products/product_k_1_1.jpg", "/products/product_k_1_2.jpg"],
  },
  {
    cardboardname: "Kraft Takeaway Paper Bags 9\" x 8.5\" x 5.5\"",
    description:
      "Kraft takeaway paper bags for single and small orders. Fits a single cookie, kraft bento box, or bagasse bento box. Cost effective, eco friendly, and sturdy so your product reaches in perfect shape.",
    description_long: `Perfect for single and small orders, these kraft takeaway paper bags fit one cookie, a kraft bento box, or a bagasse bento box with ease. Made from 90 gsm brown kraft paper, they are sturdy enough to keep your product in perfect shape from kitchen to customer.

The 9 x 8.5 x 5.5 inch size is compact and cost effective without compromising on quality. Use them for cafés, bakeries, or any business that needs a reliable, eco friendly option for small takeaway orders. The bags are recyclable and a sustainable choice for brands that care about their environmental impact.

Sturdy design and a clean brown finish make these bags practical for everyday use. Order in bulk for better rates and keep your small order packaging consistent and professional.`,
    dimensions: { length: 9, width: 8.5, depth: 5.5 },
    rate: 240,
    minOrder: 10,
    quantity: 500,
    sku: "KRAFT-BAG-9",
    price_tiers: [
      { pcs: 10, price: 240 },
      { pcs: 25, price: 600 },
      { pcs: 50, price: 1000 },
      { pcs: 100, price: 1900 },
    ],
    features: [
      "9 x 8.5 x 5.5 inch, brown 90 gsm kraft paper",
      "Perfect for single and small orders",
      "Fits single cookie, kraft bento box, or bagasse bento box",
      "Cost effective, eco friendly, sturdy design",
    ],
    images: ["/products/product_k_2_1.jpg", "/products/product_k_2_2.jpg"],
  },
  {
    cardboardname: "Kraft Paper Cookie Bag 7.5\" x 4\" x 3\"",
    description:
      "Perfect for serving cookies, sandwiches, pastries, fries, and more with a natural eco friendly touch. 80 gsm food grade kraft paper. Ideal for bakeries, cafés, and takeaways.",
    description_long: `Our kraft paper cookie bag in 7.5 x 4 x 3 inches is made for cookies, sandwiches, pastries, fries, and similar items. The natural kraft look adds an eco friendly touch to your packaging while keeping contents secure.

Made from 80 gsm food grade kraft paper, the bag is safe for direct contact with food and holds its shape. Use it in bakeries, cafés, or takeaways for single portions or small treats. The compact size fits neatly on the counter and in customer hands. Fully recyclable and a sustainable choice for brands that want to reduce plastic use without giving up durability or presentation.`,
    dimensions: { length: 7.5, width: 4, depth: 3 },
    rate: 220,
    minOrder: 10,
    quantity: 500,
    sku: "KRAFT-COOKIE-7.5",
    price_tiers: [
      { pcs: 10, price: 220 },
      { pcs: 25, price: 550 },
      { pcs: 50, price: 840 },
      { pcs: 100, price: 1700 },
    ],
    features: [
      "7.5 x 4 x 3 inch, 80 gsm food grade kraft paper",
      "Ideal for cookies, sandwiches, pastries, fries",
      "Eco friendly and recyclable",
      "Safe for food contact",
    ],
    images: ["/products/product_k_3_1.png", "/products/product_k_3_2.png"],
  },
  {
    cardboardname: "Kraft Paper Bag for Cake Boxes 12.5\" x 12.5\" x 10.5\"",
    description:
      "Perfect for carrying large cake, brownie, or cupcake boxes. Sturdy kraft bags for a reliable, eco friendly packaging solution. 110 gsm kraft paper. Ideal for bakeries and patisseries.",
    description_long: `These kraft paper bags are built to carry large cake boxes, brownie boxes, or cupcake boxes. Made from 110 gsm kraft paper, they offer a strong, eco friendly way to hand over orders to your customers.

The 12.5 x 12.5 x 10.5 inch size fits standard large cake and pastry boxes, so cakes and baked goods stay protected from kitchen to door. The natural kraft finish looks professional and is fully recyclable. Use them in bakeries, patisseries, or for event orders where presentation and durability matter. Order in bulk for better value and keep your cake and pastry packaging consistent and sustainable.`,
    dimensions: { length: 12.5, width: 12.5, depth: 10.5 },
    rate: 750,
    minOrder: 10,
    quantity: 500,
    sku: "KRAFT-CAKE-12.5",
    price_tiers: [
      { pcs: 10, price: 750 },
      { pcs: 25, price: 1875 },
      { pcs: 50, price: 3600 },
      { pcs: 100, price: 7200 },
    ],
    features: [
      "12.5 x 12.5 x 10.5 inch, 110 gsm kraft paper",
      "Carries large cake, brownie, and cupcake boxes",
      "Sturdy and eco friendly",
      "Ideal for bakeries and patisseries",
    ],
    images: ["/products/product_k_4_1.png", "/products/product_k_4_2.png"],
  },
  {
    cardboardname: "Kraft Paper Bakery Bag 10\" x 6.5\" x 6\"",
    description:
      "Carry your baked goods in style with a sturdy, eco friendly kraft bag. Natural 110 gsm kraft paper with twisted rope handles. Ideal for bread, pastries, and bakery takeaway.",
    description_long: `Our kraft paper bakery bag is made for carrying bread, pastries, and other baked goods with a sturdy, eco friendly touch. The 10 x 6.5 x 6 inch size fits loaves, boxes, or multiple items, and the twisted rope handles make the bag easy to carry.

Made from natural 110 gsm kraft paper, the bag holds its shape and keeps your products presentable. The natural finish is recyclable and a sustainable choice for bakeries and cafés that want to cut down on plastic. Use it for daily takeaway, weekend orders, or gifting. Strong construction and reliable handles mean your baked goods reach the customer in good condition.`,
    dimensions: { length: 10, width: 6.5, depth: 6 },
    rate: 550,
    minOrder: 10,
    quantity: 500,
    sku: "KRAFT-BAKERY-10",
    price_tiers: [
      { pcs: 10, price: 550 },
      { pcs: 25, price: 1375 },
      { pcs: 50, price: 2500 },
      { pcs: 100, price: 4900 },
    ],
    features: [
      "10 x 6.5 x 6 inch, natural 110 gsm kraft paper",
      "Twisted rope handles for easy carrying",
      "Ideal for bread, pastries, bakery takeaway",
      "Sturdy and eco friendly",
    ],
    images: ["/products/product_k_5_1.png", "/products/product_k_5_2.png"],
  },
  {
    cardboardname: "Kraft Paper Bag with Twisted Rope Handle 9\" x 9\" x 5\"",
    description:
      "Perfect for bakeries, gifting, or groceries. Durable kraft bag with twisted rope handles. Reusable and compostable for an eco friendly choice. 90 gsm kraft paper.",
    description_long: `This kraft paper bag with twisted rope handles is built for bakeries, gifting, or groceries. The 9 x 9 x 5 inch size fits pastries, loaves, or a few grocery items, and the rope handles make it easy to carry and reuse.

Made from 90 gsm kraft paper, the bag is durable enough for multiple uses and is compostable when you are done. The natural kraft look works for retail, markets, or takeaway. Use it for bakery orders, gift packaging, or light grocery runs. Sturdy construction and strong handles keep contents secure. An eco friendly choice that does not compromise on strength or presentation.`,
    dimensions: { length: 9, width: 9, depth: 5 },
    rate: 570,
    minOrder: 10,
    quantity: 500,
    sku: "KRAFT-ROPE-9",
    price_tiers: [
      { pcs: 10, price: 570 },
      { pcs: 25, price: 1425 },
      { pcs: 50, price: 2250 },
      { pcs: 100, price: 4300 },
    ],
    features: [
      "9 x 9 x 5 inch, 90 gsm kraft paper with twisted rope handles",
      "Perfect for bakeries, gifting, or groceries",
      "Reusable and compostable, eco friendly",
      "Durable and easy to carry",
    ],
    images: ["/products/product_k_6_1.png", "/products/product_k_6_2.png"],
  },
  {
    cardboardname: "Kraft Paper Bag with Twisted Rope 12\" x 10\" x 4.5\"",
    description:
      "Sturdy and stylish kraft bags with twisted rope handles, perfect for retail, gifts, or daily use. A great eco friendly alternative to plastic. 90 gsm kraft paper.",
    description_long: `Our kraft paper bag with twisted rope handles in 12 x 10 x 4.5 inches is built for retail, gifting, or everyday use. Made from 90 gsm kraft paper, it is sturdy and stylish and offers a strong, eco friendly alternative to plastic bags.

The roomy size fits clothing, books, baked goods, or multiple smaller items, and the twisted rope handles make the bag comfortable to carry and easy to reuse. The natural kraft look works for shops, markets, or gift giving. Use it for retail packaging, event favours, or daily errands. Durable construction and reliable handles keep contents secure. Fully recyclable and a practical choice for businesses and customers who want to cut down on plastic without giving up style or strength.`,
    dimensions: { length: 12, width: 10, depth: 4.5 },
    rate: 560,
    minOrder: 10,
    quantity: 500,
    sku: "KRAFT-ROPE-12",
    price_tiers: [
      { pcs: 10, price: 560 },
      { pcs: 25, price: 1300 },
      { pcs: 50, price: 2400 },
      { pcs: 100, price: 4500 },
    ],
    features: [
      "12 x 10 x 4.5 inch, 90 gsm kraft paper with twisted rope handles",
      "Sturdy and stylish, ideal for retail, gifts, or daily use",
      "Eco friendly alternative to plastic, recyclable",
      "Strong handles and durable construction",
    ],
    images: ["/products/product_k_7_1.png", "/products/product_k_7_2.png"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Ali Raza", rating: 5, comment: "Holds multiple takeaway boxes well. Sturdy and eco friendly. Using for our restaurant." },
    { authorName: "Sara Khan", rating: 5, comment: "Good size for family combos. No tears, strong handles. Will reorder." },
    { authorName: "Omar Farooq", rating: 5, comment: "Clean look and recyclable. Delivery customers like the bags." },
    { authorName: "Hina Noor", rating: 5, comment: "Bulk order was great value. Bags hold shape. Recommended." },
    { authorName: "Faisal Ahmed", rating: 5, comment: "14 x 9 x 5 fits our boxes perfectly. Reliable for takeaway." },
  ],
  [
    { authorName: "Zainab Ali", rating: 5, comment: "Perfect for single bento and cookies. Cost effective and sturdy." },
    { authorName: "Tariq Mahmood", rating: 5, comment: "Small orders look neat in these bags. Eco friendly too." },
    { authorName: "Ayesha Malik", rating: 5, comment: "Fits kraft bento box seamlessly. Good quality for the price." },
    { authorName: "Bilal Hassan", rating: 5, comment: "Using for café takeaway. Product reaches in perfect shape." },
    { authorName: "Nadia Sheikh", rating: 5, comment: "Wallet friendly and sustainable. Will order again." },
  ],
  [
    { authorName: "Imran Rashid", rating: 5, comment: "Perfect for cookies and pastries. Food grade and sturdy. Using for our bakery." },
    { authorName: "Sana Parveen", rating: 5, comment: "Eco friendly touch customers notice. Good size for single portions." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Fries and sandwiches pack well. No leaks, holds shape. Will reorder." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "80 gsm is strong enough. Natural look we wanted. Recommended." },
    { authorName: "Haris Mahmood", rating: 5, comment: "Cookie bag size is just right. Bulk price is fair. Happy with purchase." },
  ],
  [
    { authorName: "Rashid Ali", rating: 5, comment: "Fits our large cake boxes perfectly. Sturdy 110 gsm. Bakeries should try these." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Brownie and cupcake boxes slide in easily. Eco friendly and reliable." },
    { authorName: "Usman Khan", rating: 5, comment: "Using for event orders. Cakes arrive in good shape. Will order again." },
    { authorName: "Amina Sheikh", rating: 5, comment: "Professional look and recyclable. Good value in bulk." },
    { authorName: "Farhan Malik", rating: 5, comment: "Best kraft bag we have used for cake boxes. Recommended." },
  ],
  [
    { authorName: "Bushra Khan", rating: 5, comment: "Rope handles are strong. Bread and pastries carry well. Eco friendly." },
    { authorName: "Junaid Ali", rating: 5, comment: "10 x 6.5 x 6 fits our loaves. Customers like the natural look." },
    { authorName: "Sadia Farooq", rating: 5, comment: "Sturdy bag for bakery takeaway. No tears. Will reorder." },
    { authorName: "Waqas Ahmed", rating: 5, comment: "Twisted rope handles make it easy to carry. Good quality kraft." },
    { authorName: "Lubna Noor", rating: 5, comment: "Using for daily takeaway. Baked goods reach in perfect shape. Recommended." },
  ],
  [
    { authorName: "Tariq Mahmood", rating: 5, comment: "Rope handle bag is sturdy and reusable. Using for bakery and gifting. Eco friendly." },
    { authorName: "Sana Ahmed", rating: 5, comment: "Perfect for groceries and pastries. Compostable and strong. Will reorder." },
    { authorName: "Imran Khan", rating: 5, comment: "9 x 9 x 5 fits our boxes well. Customers like the natural look. Recommended." },
    { authorName: "Amina Hassan", rating: 5, comment: "Twisted rope handles are comfortable. Good for gifting. Happy with purchase." },
    { authorName: "Farhan Rashid", rating: 5, comment: "Reusable and compostable. Exactly what we wanted for our bakery. Will order again." },
  ],
  [
    { authorName: "Rukhsar Ali", rating: 5, comment: "12 x 10 size is perfect for retail. Sturdy rope handles and eco friendly. Using for our store." },
    { authorName: "Danish Khan", rating: 5, comment: "Great alternative to plastic. Stylish and strong. Customers ask where we get these bags." },
    { authorName: "Zara Hussain", rating: 5, comment: "Use for gifts and daily shopping. Holds shape well. Will reorder in bulk." },
    { authorName: "Hamza Sheikh", rating: 5, comment: "Good value for 50 pieces. Rope handles are comfortable. Recommended for retail." },
    { authorName: "Ayesha Farooq", rating: 5, comment: "Eco friendly and durable. Perfect for clothing and small goods. Happy with purchase." },
  ],
];

const reviewDates = [
  "2024-03-12 10:00:00", "2024-06-20 14:30:00", "2024-09-05 09:15:00", "2025-01-08 11:45:00", "2025-04-22 16:00:00",
  "2024-04-18 08:30:00", "2024-07-10 13:00:00", "2024-10-28 10:20:00", "2025-02-14 15:30:00", "2025-05-10 09:00:00",
  "2024-05-02 11:00:00", "2024-08-15 14:00:00", "2024-11-20 08:45:00", "2025-03-05 12:00:00", "2025-06-18 10:30:00",
  "2024-05-25 09:30:00", "2024-09-12 16:00:00", "2024-12-08 11:15:00", "2025-03-28 14:45:00", "2025-07-02 08:00:00",
  "2024-06-08 14:20:00", "2024-10-01 10:00:00", "2025-01-20 13:30:00", "2025-04-15 09:45:00", "2025-08-10 15:00:00",
  "2024-07-22 11:30:00", "2024-11-15 08:00:00", "2025-02-28 16:20:00", "2025-05-25 10:15:00", "2025-09-05 12:45:00",
  "2024-08-05 09:00:00", "2024-11-22 14:00:00", "2025-02-10 11:30:00", "2025-06-01 16:45:00", "2025-09-15 10:15:00",
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories first.");
  process.exit(1);
}

const db = new Database(dbPath);

// Ensure parent_id exists (for top-level category)
try {
  db.exec("ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id)");
} catch (_) {}

let catRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ? AND parent_id IS NULL").get(CATEGORY_NAME);
if (!catRow) {
  const insertCat = db.prepare(
    `INSERT INTO categories (parent_id, cardboardname, description, heading, img, description_long, features) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  insertCat.run(
    null,
    categoryData.cardboardname,
    categoryData.description,
    null,
    JSON.stringify(categoryData.img),
    categoryData.description_long,
    JSON.stringify(categoryData.features)
  );
  catRow = { id: db.prepare("SELECT last_insert_rowid() as id").get().id };
  console.log("  + Category added:", CATEGORY_NAME);
} else {
  db.prepare("UPDATE categories SET img = ?, description = ?, description_long = ?, features = ? WHERE id = ?").run(
    JSON.stringify(categoryData.img),
    categoryData.description,
    categoryData.description_long,
    JSON.stringify(categoryData.features),
    catRow.id
  );
  console.log("  Updated category image and content for", CATEGORY_NAME);
}

const categoryId = catRow.id;

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
console.log("\nDone. Kraft Paper Products category and", products.length, "products seeded. Category image:", CATEGORY_IMAGE, "Restart dev server and refresh.");
