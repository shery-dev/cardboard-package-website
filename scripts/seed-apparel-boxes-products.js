/**
 * Seed Apparel Boxes subcategory with 5 products (from Ecommerce and Cartons). Sets subcategory image to product_e_1_1.jpg.
 * Run from project root: node scripts/seed-apparel-boxes-products.js
 * Run after seed-categories and seed-corrugated-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Apparel Boxes";

const products = [
  {
    cardboardname: "Product Box | 0.3 KG",
    description:
      "Small product box made from durable, eco friendly materials. Exceptional protection for delicate items. Ideal for jewelry, cosmetics and small treasures. Sleek, customizable design. Self assembling lock system.",
    description_long: `Your items deserve a high level of care. Our small product box is made from robust, quality materials that protect your products from dust, moisture, and physical impact so they stay in original condition whether stored or dispatched.

Make a lasting impression with our product box, which combines function with a clean look. The box has a modern, neat design that adds a touch of refinement to any item. Available in a variety of finishes and colors, it can be customized to reflect your brand or personal style.

From fine jewelry and cosmetics to tech accessories and small gifts, our small product box is versatile enough for a wide range of items. Its compact size is ideal for organizing inventory or presenting gifts with a touch of class. The box is designed for easy assembly with pre-scored lines and straightforward instructions. Our box is made from eco friendly, recyclable materials. You can personalize it with your logo, brand colors, or unique design to create a strong marketing tool and a consistent brand experience from the moment the product is delivered.`,
    dimensions: { length: 10.2, width: 5.5, depth: 2 },
    rate: 280,
    minOrder: 5,
    quantity: 500,
    sku: "APPAREL-PB-03",
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
    cardboardname: "Custom Apparel Box | For Jackets",
    description:
      "Wrinkle-free fashion packaging. Jacket and apparel boxes keep clothes protected during storage and shipping. Sturdy 3 ply kraft board in a slim design. Ideal for jackets, hoodies, sweaters and more.",
    description_long: `Our jacket boxes feature a slim design that keeps coats, jackets, and hanging attire wrinkle-free and secure. The sturdy cardboard construction protects your clothes during storage or shipping so they arrive looking their best.

We offer a wide range of apparel packing boxes in various sizes and shapes. From flat boxes for folded shirts to sturdy cartons for heavy sweaters, you can pack clothes neatly and securely. The boxes come folded for quick assembly and have secure closures to keep belongings safe during storage or shipping.

Whether you are packing a single outfit or a full wardrobe, there is a size to fit. Our carton boxes are available in multiple dimensions to suit jackets, leather jackets, hoodies, sweatshirts, clothing items and more.`,
    dimensions: { length: 18.5, width: 14, depth: 3.5 },
    rate: 700,
    minOrder: 5,
    quantity: 500,
    sku: "APPAREL-JACKET",
    price_tiers: [
      { pcs: 5, price: 700 },
      { pcs: 10, price: 1400 },
      { pcs: 15, price: 2100 },
      { pcs: 20, price: 2800 },
    ],
    features: [
      "18.5 x 14 x 3.5 inch, brown 3 ply corrugated kraft board",
      "Slim design for jackets and hanging apparel",
      "Wrinkle-free storage and shipping",
      "Ideal for jackets, hoodies, sweaters, clothing",
    ],
    images: ["/products/product_e_1_1.jpg", "/products/product_e_1_2.jpg"],
  },
  {
    cardboardname: "Custom Apparel Box | For T-Shirt",
    description:
      "Custom apparel boxes for T-shirts, garments and kurtis. Multiple sizes for a perfect fit. Durable cardboard keeps clothes wrinkle-free. Brandable with logo and designs.",
    description_long: `Our custom apparel boxes are made from durable cardboard and come in a range of sizes. From light tank tops to wool sweaters, you can find the right fit for your wardrobe. No more ill-fitting boxes that crease or damage your clothes.

We offer full customization so you can bring your brand to life. Choose from a range of colors and printing options to create boxes that reflect your brand. Add your logo, tagline, or custom message to make a lasting impression on your customers.

Our clothing boxes lift the customer experience. When your customers receive their purchases in well designed boxes that carry your brand, it creates a positive and memorable association. Every time they carry or store their purchase, your brand is visible.`,
    dimensions: { length: 14, width: 9.5, depth: 2.5 },
    rate: 475,
    minOrder: 5,
    quantity: 500,
    sku: "APPAREL-TSHIRT",
    price_tiers: [
      { pcs: 5, price: 475 },
      { pcs: 10, price: 950 },
      { pcs: 25, price: 2375 },
    ],
    features: [
      "14 x 9.5 x 2.5 inch, brown 3 ply corrugated kraft board",
      "Ideal for T-shirts, garments, kurtis",
      "Custom printing and branding",
      "Wrinkle-free packaging",
    ],
    images: ["/products/product_e_2_1.jpg", "/products/product_e_2_2.jpg"],
  },
  {
    cardboardname: "Frame Carton",
    description:
      "Protect your artwork with our custom sized frame cartons. Safe, secure, and stylish packaging for your valuable pieces. Sturdy corrugated construction with optional protective inserts.",
    description_long: `Frame cartons, also known as picture frame boxes, are designed to protect fragile items during shipment, storage, or moving. We offer a range of high quality frame cartons that provide strong protection for your artwork, mirrors, and other delicate items.

We understand that every piece of art or mirror is unique. That is why we offer custom size frame cartons to ensure a perfect fit. Whether you are an artist, a gallery retailer, or someone with treasured artwork, our options cater to your needs. We can add your logo, artwork, or other branding to your frame cartons.

Our frame cartons are made from sturdy corrugated cardboard and provide cushioning and protection against shocks, vibrations, and moisture. The interior can be equipped with protective inserts or dividers to prevent movement and damage during carriage.`,
    dimensions: { length: 20, width: 18, depth: 4 },
    rate: 925,
    minOrder: 5,
    quantity: 100,
    sku: "APPAREL-FRAME",
    price_tiers: [
      { pcs: 5, price: 925 },
      { pcs: 10, price: 1800 },
      { pcs: 15, price: 2700 },
      { pcs: 20, price: 3600 },
    ],
    features: [
      "Custom dimensions to fit your artwork",
      "5 PLY (KL 120 x 2 + SF 120 x 3), brown, volumetric weight 5 KG",
      "Protective inserts available",
      "Eco friendly materials, optional custom printing",
    ],
    images: ["/products/product_c_4_1.jpg", "/products/product_c_4_2.jpg"],
  },
  {
    cardboardname: "Packing Box | For Shoes",
    description:
      "Shoe packing box for durability and style. Protects footwear from dirt and damage. Sleek design with transparent front for easy viewing. Ideal for all shoe types. Eco friendly materials. Order yours today.",
    description_long: `Our shoe packing box is designed with both functionality and style in mind, giving you a practical way to keep your footwear in perfect condition and add a touch of order to your storage space. Whether you are a sneaker enthusiast with a large collection, a fashion lover, or someone looking for a smarter way to store shoes, our packing box is a solid choice.

Your shoes deserve good care. Our shoe packing box is made from quality, sturdy materials that protect your footwear from dirt and damage. The robust construction helps your shoes keep their shape and appearance whether in long-term storage or waiting for their next wear. The box has a clean, modern design that fits any decor. With a transparent front panel, you can see the contents without opening the box, making it easy to find the right pair. Our packing box is not only for shoes. Its design works well for storing accessories, small clothing, or craft supplies. The modular design allows for easy stacking and organization. The box has a user-friendly design with a hinged lid that opens smoothly for quick access. Our shoe packing box is made from eco friendly materials that are recyclable and biodegradable. Available in multiple sizes to suit various shoe types, from high heels to sneakers.`,
    dimensions: { length: 12.8, width: 8.5, depth: 5 },
    rate: 650,
    minOrder: 5,
    quantity: 500,
    sku: "APPAREL-SHOES",
    price_tiers: [
      { pcs: 5, price: 650 },
      { pcs: 10, price: 1250 },
      { pcs: 25, price: 3000 },
      { pcs: 50, price: 5800 },
      { pcs: 100, price: 11500 },
    ],
    features: [
      "12.8 x 8.5 x 5 inch, volumetric weight 2 KG",
      "3 PLY (Kraft 170 + SF 120 + KL 170), ideal for shoes",
      "Transparent front panel, sturdy construction",
      "Eco friendly, recyclable materials",
    ],
    images: ["/products/product_e_8_1.jpg", "/products/product_e_8_2.jpg"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Samina Abbas", rating: 5, comment: "Perfect for jewelry and cosmetics. Sleek and customizable." },
    { authorName: "Kashif Mehmood", rating: 5, comment: "Self assembling lock is handy. Quick to set up." },
    { authorName: "Nida Hassan", rating: 5, comment: "Small but sturdy. Great for small treasures and gifts." },
    { authorName: "Arsalan Khan", rating: 5, comment: "Eco friendly and good quality. Branding looked sharp." },
    { authorName: "Saba Riaz", rating: 5, comment: "Ideal for organizing inventory. Will order again." },
  ],
  [
    { authorName: "Tariq Mahmood", rating: 5, comment: "Perfect for shipping jackets. No wrinkles, sturdy and professional." },
    { authorName: "Sana Ahmed", rating: 5, comment: "Great size for hoodies and coats. Our brand packaging looks top notch." },
    { authorName: "Imran Khan", rating: 5, comment: "Easy to assemble. Clothes arrived in perfect condition every time." },
    { authorName: "Amina Hassan", rating: 5, comment: "Best jacket boxes we have used. Will reorder for our store." },
    { authorName: "Farhan Rashid", rating: 5, comment: "Slim design saves space. Quality kraft board. Very satisfied." },
  ],
  [
    { authorName: "Zara Sheikh", rating: 5, comment: "Ideal for T-shirts and kurtis. Custom print came out great." },
    { authorName: "Bilal Noor", rating: 5, comment: "No more creased clothes. Boxes are strong and presentable." },
    { authorName: "Hina Malik", rating: 5, comment: "Using for our apparel brand. Customers love the unboxing." },
    { authorName: "Waqas Choudhry", rating: 5, comment: "Good value in bulk. Multiple sizes fit our range." },
    { authorName: "Sadia Farooq", rating: 5, comment: "Reliable and wrinkle-free. Recommended for garments." },
  ],
  [
    { authorName: "Rashid Ali", rating: 5, comment: "Perfect fit for our frames. Artwork arrived without a scratch." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Custom size option is great. Strong 5 ply protection." },
    { authorName: "Usman Khan", rating: 5, comment: "Ideal for mirrors and artwork. Professional packaging." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "Secure and easy to pack. Use for all our frame shipments." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Best frame cartons we have found. Highly recommend." },
  ],
  [
    { authorName: "Nida Hassan", rating: 5, comment: "Shoe box with clear front is genius. Easy to find pairs." },
    { authorName: "Arsalan Sheikh", rating: 5, comment: "Sturdy and eco friendly. Sneaker collection looks tidy." },
    { authorName: "Saba Riaz", rating: 5, comment: "Perfect size for all shoe types. No damage in shipping." },
    { authorName: "Fahad Khan", rating: 5, comment: "Bulk order for our store. Quality consistent." },
    { authorName: "Ayesha Siddiqui", rating: 5, comment: "Modern design and strong. Will reorder." },
  ],
];

const reviewDates = [
  "2024-03-12 10:00:00", "2024-06-20 14:30:00", "2024-09-05 09:15:00", "2025-01-08 11:45:00", "2025-04-22 16:00:00",
  "2024-04-18 08:30:00", "2024-07-10 13:00:00", "2024-10-28 10:20:00", "2025-02-14 15:30:00", "2025-05-10 09:00:00",
  "2024-05-02 11:00:00", "2024-08-15 14:00:00", "2024-11-20 08:45:00", "2025-03-05 12:00:00", "2025-06-18 10:30:00",
  "2024-05-25 09:30:00", "2024-09-12 16:00:00", "2024-12-08 11:15:00", "2025-03-28 14:45:00", "2025-07-02 08:00:00",
  "2024-06-08 14:20:00", "2024-10-01 10:00:00", "2025-01-20 13:30:00", "2025-04-15 09:45:00", "2025-08-10 15:00:00",
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

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_e_1_1.jpg"]), categoryId);
console.log("  Updated Apparel Boxes subcategory image to product_e_1_1.jpg");

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
console.log("\nDone. Seeded 5 Apparel Boxes products and set subcategory image. Restart dev server and refresh.");
