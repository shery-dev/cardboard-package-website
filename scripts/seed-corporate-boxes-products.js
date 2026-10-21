/**
 * Seed Corporate Boxes subcategory with 8 products (from Ecommerce and Cartons). Sets subcategory image to product_e_3_1.jpg.
 * Run from project root: node scripts/seed-corporate-boxes-products.js
 * Run after seed-categories and seed-corrugated-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Corporate Boxes";

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
    sku: "CORP-PB-03",
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
    cardboardname: "Corrugated Packaging | Universal Carton",
    description:
      "Universal carton with lid and hand inserts. The perfect combination of sturdiness, convenience, and eco friendly design. Browse our wide selection of sizes for shipping, storage, and organization. Strong protection and smooth shipping.",
    description_long: `Our corrugated packaging brings the perfect blend of stability, security, and convenience for all your shipping needs. Made from layers of ridged cardboard, these boxes are surprisingly solid and provide reliable protection for your valuable products during storage or carriage.

Our corrugated packaging comes in a variety of sizes and thicknesses to cater to all your packing needs. Whether you're shipping fragile artwork, heavy shelves, or anything in between, we have a box that's the ideal fit. The resilient, corrugated construction ensures your products reach their destination safely and securely.

Don't be fooled by their lightweight design. Our packing boxes deliver impressive strength despite being surprisingly light. This translates to reduced shipping costs without sacrificing protection for your products.

The unique corrugated design is built for ease of use. The simple fold and tuck design allows for swift assembly. Corrugated cardboard is a readily recyclable material, making it an ideal choice for eco conscious businesses and individuals.

Our packaging boxes are more than just shipping boxes. They're also ideal for storing items in your home or office. Organize your belongings, keep items safe from dust and damage, and enjoy the clean lines and stackable design of these versatile boxes. Order yours today.`,
    dimensions: { length: 15, width: 12, depth: 10 },
    rate: 375,
    minOrder: 1,
    quantity: 100,
    sku: "CORP-UNIV",
    price_tiers: [
      { pcs: 1, price: 375 },
      { pcs: 2, price: 750 },
      { pcs: 5, price: 1875 },
    ],
    features: [
      "Universal box with lid and hand inserts",
      "Brown color, 5 PLY pressed (KL 150 x 2 + SF 120 x 3)",
      "Sturdy, convenient, and eco friendly",
      "Ideal for shipping, storage, and organization",
    ],
    images: ["/products/product_c_1_1.png", "/products/product_c_1_2.png"],
  },
  {
    cardboardname: "Frame Carton",
    description:
      "Protect your artwork with our custom sized frame cartons. Safe, secure, and stylish packaging for your valuable pieces. Sturdy corrugated construction with optional protective inserts.",
    description_long: `Frame cartons, also known as picture frame boxes, are precisely designed to protect your fragile products during shipment, storage, or moving. We offer a range of high quality frame cartons that provide exceptional protection for your artwork, mirrors, and other delicate items.

We understand that every piece of art or mirror is unique. That's why we offer custom size frame cartons to ensure a perfect fit. Whether you're an artist, a gallery retailer, or simply someone with treasured artwork, our customizable options cater to your particular needs. We can also add your logo, artwork, or other branding elements to your frame cartons.

Our frame cartons are made using sturdy corrugated cardboard, providing excellent cushioning and protection against shocks, vibrations, and moisture. The interior of the box is often equipped with protective inserts or dividers to prevent movement and damage during carriage. We prioritize the safety of your valuable products, and our frame cartons are designed to meet your expectations. By choosing us for your frame packaging needs, you're investing in the safety and presentation of your precious artwork.`,
    dimensions: { length: 20, width: 18, depth: 4 },
    rate: 925,
    minOrder: 5,
    quantity: 100,
    sku: "CORP-FRAME",
    price_tiers: [
      { pcs: 5, price: 925 },
      { pcs: 10, price: 1800 },
      { pcs: 15, price: 2700 },
      { pcs: 20, price: 3600 },
    ],
    features: [
      "Custom dimensions to fit your artwork perfectly",
      "5 PLY (KL 120 x 2 + SF 120 x 3), brown color",
      "Volumetric weight 5 KG, protective inserts available",
      "Eco friendly materials, optional custom printing",
    ],
    images: ["/products/product_c_4_1.jpg", "/products/product_c_4_2.jpg"],
  },
  {
    cardboardname: "Laptop Box",
    description:
      "Custom sized laptop boxes made from strong corrugated cardboard for secure shipping, storage, or gifting. Multiple sizes to fit your laptop. Soft inner lining protects from scratches.",
    description_long: `Our laptop box provides strong protection for your valuable device. Made from quality, sturdy materials, these laptop boxes come in multiple sizes to fit your laptop and keep it safe during shipping.

We understand that laptops come in all shapes and sizes. We offer a range of packaging options to fit yours snugly so your device does not bounce around inside a box that is too big. Our laptop boxes are designed to keep your machine safe from bumps and knocks. The sturdy cardboard provides protection against daily wear and tear, and the soft inner lining cushions your device and helps prevent scratches.

If you are sending your laptop for repairs or gifting a new one, our laptop boxes give you peace of mind. The secure lid keeps your device in place and the sturdy design can handle the demands of shipping. They also work as storage when the laptop is not in use, keeping it dust-free and protected on a shelf or in a cupboard.`,
    dimensions: { length: 18.5, width: 14, depth: 3.5 },
    rate: 700,
    minOrder: 5,
    quantity: 500,
    sku: "CORP-LAPTOP",
    price_tiers: [
      { pcs: 5, price: 700 },
      { pcs: 10, price: 1400 },
      { pcs: 15, price: 2100 },
      { pcs: 20, price: 2800 },
    ],
    features: [
      "18.5 x 14 x 3.5 inch, brown 3 ply corrugated kraft board",
      "Ideal for laptops, jackets, shirts, baby blankets",
      "Soft inner lining, secure closure",
      "Multiple sizes available",
    ],
    images: ["/products/product_e_4_1.jpg", "/products/product_e_4_2.jpg"],
  },
  {
    cardboardname: "Packing Box | 1 KG",
    description:
      "Packaging box 1 KG for items up to 1 kilogram. Exceptional resilience and strength. Ideal for shoes and single clothing items. Easy to stack and store. Eco friendly recyclable materials.",
    description_long: `Our packaging box 1 KG is built to give your goods strong protection. Made with care, this box is a solid choice for items weighing up to 1 kilogram.

Assembled from quality materials, our packaging box 1 KG offers good resilience and strength. Whether you ship fragile items or heavier products, the box is built to withstand the rigors of transit so your products arrive at their destination safely.

Our cardboard box 1 KG is designed for ease of use and convenience. Its sturdy construction makes it easy to stack and store, and its compact size takes up less space during storage or shipping. We are committed to sustainability: our kraft box 1 KG is made from recycled materials and is fully recyclable. These boxes can be used for many products including shoes, clothes and apparel. With its strength, durability, and eco friendly design, our corrugated box 1 KG is a reliable solution for secure packaging.`,
    dimensions: { length: 11.5, width: 7.5, depth: 4 },
    rate: 412,
    minOrder: 5,
    quantity: 500,
    sku: "CORP-PB-1",
    price_tiers: [
      { pcs: 5, price: 412 },
      { pcs: 10, price: 820 },
      { pcs: 25, price: 2050 },
      { pcs: 50, price: 4100 },
    ],
    features: [
      "11.5 x 7.5 x 4 inch, volumetric weight 1 KG",
      "3 PLY (Kraft 120 + SF 120 + KL 120)",
      "Ideal for shoes and single clothing items",
      "Eco friendly, easy to stack",
    ],
    images: ["/products/product_e_8_1.jpg", "/products/product_e_8_2.jpg"],
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
    sku: "CORP-CARTON",
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
    cardboardname: "Shipping Box 3 Kg",
    description:
      "Your go to solution for reliable corrugated shipping boxes. Created with your requirements in focus, giving a reliable and consistent solution for all your shipping needs. Durable construction for safe delivery.",
    description_long: `We understand the importance of safe and secure shipping. That is why our packaging box is made from quality corrugated cardboard. This ensures that your items are safe during movement, giving you peace of mind knowing that your package will arrive safely at its destination.

Our packing box is not only durable but also reliable, making it suitable for a wide range of items. Whether you're shipping small electronics, clothing, or accessories, our packaging boxes provide the perfect packaging solution.

Key features of our 3 KG Shipping Box include durable construction from solid corrugated cardboard, so the box can withstand the rigors of shipping and your items remain safe and secure. The boxes are easy to assemble, saving you time and effort when preparing your packages for shipping. We offer customizable options so you can add your logo or branding for a professional finish. Our carton boxes are made from recycled materials, making them an eco friendly choice for your packaging requirements. Experience the comfort and ease of our carton box. Order yours today and have peace of mind knowing your items are safe during carriage.`,
    dimensions: { length: 14, width: 10.75, depth: 6.75 },
    rate: 400,
    minOrder: 5,
    quantity: 100,
    sku: "CORP-SHIP3",
    price_tiers: [
      { pcs: 5, price: 400 },
      { pcs: 10, price: 800 },
      { pcs: 15, price: 1155 },
      { pcs: 20, price: 1500 },
    ],
    features: [
      "Volumetric weight 3 KG, brown color",
      "3 PLY (Kraft 160 x 2 + SF 120 x 1)",
      "Durable construction, easy to assemble",
      "Eco friendly recycled materials",
    ],
    images: ["/products/product_c_5_1.png", "/products/product_c_5_2.png"],
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
    sku: "CORP-SHOES",
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
    { authorName: "Nida Hassan", rating: 5, comment: "Small but sturdy. Great for corporate gifting." },
    { authorName: "Arsalan Khan", rating: 5, comment: "Eco friendly and good quality. Branding looked sharp." },
    { authorName: "Saba Riaz", rating: 5, comment: "Ideal for organizing inventory. Will order again." },
  ],
  [
    { authorName: "Farhan Akhtar", rating: 5, comment: "Sturdy and easy to assemble. Lid and hand inserts are very handy." },
    { authorName: "Saima Riaz", rating: 5, comment: "Perfect for storage and shipping. Good value for the price." },
    { authorName: "Waqas Ahmed", rating: 5, comment: "Strong 5 ply construction. Items arrived safe every time." },
    { authorName: "Amina Sheikh", rating: 5, comment: "Clean finish and stackable. Using for office organization." },
    { authorName: "Haris Mahmood", rating: 5, comment: "Reliable universal carton. Will order again." },
  ],
  [
    { authorName: "Rashid Ali", rating: 5, comment: "Perfect fit for our frames. Artwork arrived without a scratch." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Custom size option is great. Strong 5 ply protection." },
    { authorName: "Usman Khan", rating: 5, comment: "Ideal for mirrors and artwork. Professional packaging." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "Secure and easy to pack. Use for all our frame shipments." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Best frame cartons we have found. Highly recommend." },
  ],
  [
    { authorName: "Bushra Khan", rating: 5, comment: "Laptop arrived safe. Perfect fit and soft lining inside." },
    { authorName: "Junaid Ali", rating: 5, comment: "We use for repairs and gifting. Sturdy and professional." },
    { authorName: "Sana Parveen", rating: 5, comment: "Multiple sizes available. No more oversized boxes." },
    { authorName: "Rizwan Hussain", rating: 5, comment: "Great for storage too. Keeps dust off when not in use." },
    { authorName: "Nabeel Sheikh", rating: 5, comment: "Best laptop box we have used. Recommended." },
  ],
  [
    { authorName: "Hina Farooq", rating: 5, comment: "Perfect for single shoes and clothing. Strong 1 KG box." },
    { authorName: "Umer Rashid", rating: 5, comment: "Easy to stack. Using for our corporate shipments." },
    { authorName: "Nida Hassan", rating: 5, comment: "Recyclable material. Good value for the size." },
    { authorName: "Arsalan Sheikh", rating: 5, comment: "No complaints. Arrives flat, assembles quickly." },
    { authorName: "Saba Riaz", rating: 5, comment: "Ideal for apparel and shoes. Recommended." },
  ],
  [
    { authorName: "Zeeshan Ali", rating: 5, comment: "10x10x10 cube is versatile. Use for storage and shipping." },
    { authorName: "Mariam Ahmed", rating: 5, comment: "Strong multi-ply. Interlocking flaps hold well." },
    { authorName: "Saad Mahmood", rating: 5, comment: "Good for documents and merchandise. Reliable." },
    { authorName: "Hina Farooq", rating: 5, comment: "Lightweight but durable. Fair price in bulk." },
    { authorName: "Umer Rashid", rating: 5, comment: "Packing carton box does the job. Recommended." },
  ],
  [
    { authorName: "Saima Riaz", rating: 5, comment: "Right size for small parcels. Easy to assemble and ship." },
    { authorName: "Haris Mahmood", rating: 5, comment: "Durable 3 ply. Electronics and clothes ship safely." },
    { authorName: "Lubna Ahmed", rating: 5, comment: "Good value and quality. Using for our office." },
    { authorName: "Asad Iqbal", rating: 5, comment: "Lightweight but strong. No damaged deliveries so far." },
    { authorName: "Zeeshan Malik", rating: 5, comment: "Reliable shipping box. Will reorder." },
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
  "2024-07-22 11:30:00", "2024-11-15 08:00:00", "2025-02-28 16:20:00", "2025-05-25 10:15:00", "2025-09-05 12:45:00",
  "2024-08-05 09:00:00", "2024-12-20 14:00:00", "2025-02-10 11:30:00", "2025-06-05 08:45:00", "2025-10-12 15:00:00",
  "2024-09-18 10:45:00", "2025-01-15 13:00:00", "2025-04-08 09:30:00", "2025-07-20 16:00:00", "2025-11-02 10:00:00",
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

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_e_3_1.jpg"]), categoryId);
console.log("  Updated Corporate Boxes subcategory image to product_e_3_1.jpg");

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
console.log("\nDone. Seeded 8 Corporate Boxes products and set subcategory image. Restart dev server and refresh.");
