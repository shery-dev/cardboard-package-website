/**
 * Seed Flat Boxes subcategory with 5 products. Run after seed-categories and seed-corrugated-subcategories.
 * Run from project root: node scripts/seed-flat-boxes-products.js
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Flat Boxes";

const products = [
  {
    cardboardname: "Flat Box 7 x 7 | Corrugated Box",
    description:
      "7 inch by 7 inch grab and go disposable boxes for treats and small meals. Handy containers for on the go convenience. Perfect for food cafes, tuck shops, food trucks, and takeout or delivery.",
    description_long: `Our 7 x 7 inch grab and go disposable boxes are built for packing delicious treats and small meals. These handy containers offer on the go convenience and are perfect for food cafes, tuck shops, food trucks, and anyone who needs a reliable way to package food for takeout or delivery.

Made from sturdy cardboard, these boxes offer the right amount of space for burgers, salads, pastries, or small portions of meals. The compact size makes them easy to hold and carry, so your customers can enjoy their food without hassle wherever they go. The secure folding design keeps contents snug and helps prevent spills or leakage during delivery.

Our 7 x 7 inch disposable boxes have a clean, tidy design that suits any food presentation. The natural color allows for easy customization. Add your logo or write messages directly on the box for a professional touch that reflects your brand.

We care about the environment as much as we care about food quality. These disposable packing boxes are made from recycled materials, so you can offer eco friendly packaging to your clients. Our 7 x 7 inch flat boxes are an ideal solution for packing small pizzas or pan pizzas with both convenience and the environment in mind. Their portability, clean design, and eco friendly materials make them a practical choice for businesses and customers alike.`,
    dimensions: { length: 7, width: 7, depth: 1.25 },
    rate: 145,
    minOrder: 5,
    quantity: 500,
    sku: "FLAT-7X7",
    price_tiers: [
      { pcs: 5, price: 145 },
      { pcs: 10, price: 290 },
      { pcs: 25, price: 725 },
      { pcs: 50, price: 1450 },
      { pcs: 100, price: 2900 },
    ],
    features: [
      "7 x 7 inch, brown kraft board, 3 ply food grade kraft",
      "Ideal for treats, small meals, takeout and delivery",
      "Clean design, easy to customize with logo or message",
      "Eco friendly, made from recycled materials",
    ],
    images: ["/products/product_p_6_1.png", "/products/product_p_6_2.jpg"],
  },
  {
    cardboardname: "Flat Box 10 x 10 | Corrugated Box",
    description:
      "10 inch by 10 inch kraft box made from recycled materials and fully recyclable. Natural kraft color, no dyes. Ideal for gifting, storage, and a variety of packaging needs. Customize with stamps, stickers, or print.",
    description_long: `Our 10 x 10 inch kraft box delivers a blend of practicality and earth friendly design. Made from quality, unbleached paperboard, this box prioritizes the planet without sparing functionality or presentation.

Environmental responsibility matters to us. Our 10 x 10 inch kraft box is made from recycled materials and is recyclable. By choosing this box, you can meet your packaging needs while reducing your environmental impact. The natural kraft color eliminates the need for dyes or extra treatments, further reducing impact.

The compact size and square design make the 10 x 10 inch kraft box versatile. Whether you are gifting delicate items, storing personal products, or packaging merchandise, this box offers good space while keeping a neat and sensible presentation. The sturdy construction means the box can handle moderate weight, so it works for various uses.

Our 10 x 10 inch packaging box provides a blank canvas for creative expression. The natural kraft finish readily accepts stamps, stickers, or custom print labels, so you can add a unique touch and showcase your brand. This box offers an eco friendly packaging solution for people and businesses alike. It blends functionality with aesthetics and is ideal for gifting, pantry storage, and a variety of other applications.`,
    dimensions: { length: 10, width: 10, depth: 1.5 },
    rate: 460,
    minOrder: 10,
    quantity: 500,
    sku: "FLAT-10X10",
    price_tiers: [
      { pcs: 10, price: 460 },
      { pcs: 25, price: 1150 },
      { pcs: 50, price: 2300 },
      { pcs: 100, price: 4600 },
    ],
    features: [
      "10 x 10 inch, brown kraft board, 3 ply food grade kraft",
      "Made from recycled materials, fully recyclable",
      "Natural kraft finish for stamps, stickers, or custom print",
      "Versatile for gifting, storage, and merchandise",
    ],
    images: ["/products/product_p_5_1.jpg", "/products/product_p_5_2.jpg"],
  },
  {
    cardboardname: "Flat Box 12 x 12 | Corrugated Box",
    description:
      "Kraft boxes and flat box 12 inch by 12 inch. Perfect for packing shirts, medium pizza, pants, and a mix of utensils. Sturdy kraft paper, easy to assemble. Ideal for retail, e-commerce, or personal storage.",
    description_long: `Our kraft boxes and flat box in 12 x 12 inch are perfect for packing shirts, medium size pizza, pants, and a variety of utensils. We offer kraft boxes sized at 12 x 12 inch as a practical packaging solution for a wide range of products.

Made from quality kraft paper, our kraft boxes and flat box are strong and durable, so your items stay protected during transportation. The 12 inch size is perfect for packaging gifts, shipping items, or organizing your cupboard.

Key features include sturdy construction from robust kraft paper, so these boxes are designed to withstand the rigors of shipping and handling and your items reach their destination safely. The 12 inch size is ideal for a variety of items, making these boxes perfect for retail, e-commerce, or personal storage. Our boxes and flat boxes are easy to assemble, saving time and effort when preparing packages for shipping. Made from recycled materials, these boxes are an eco friendly choice for your packaging needs.

If you need a practical packaging solution for your business or a roomy storage option for your home, our flat box 12 x 12 is a solid choice.`,
    dimensions: { length: 12, width: 12, depth: 1.75 },
    rate: 500,
    minOrder: 10,
    quantity: 500,
    sku: "FLAT-12X12",
    price_tiers: [
      { pcs: 10, price: 500 },
      { pcs: 25, price: 1250 },
      { pcs: 50, price: 2500 },
      { pcs: 100, price: 5000 },
    ],
    features: [
      "12 x 12 inch, brown kraft board, 3 ply food grade kraft",
      "Ideal for shirts, medium pizza, pants, utensils",
      "Sturdy construction, easy to assemble",
      "Eco friendly, made from recycled materials",
    ],
    images: ["/products/product_p_4_1.jpg", "/products/product_p_4_2.jpg"],
  },
  {
    cardboardname: "Flat Box 13 x 13 | Corrugated Box",
    description:
      "Corrugated flat boxes for reliable and sustainable packaging. Made from quality cardboard with a fluted inner layer between two flat outer liners. Strong and rigid. Ideal for packing and moving.",
    description_long: `Our corrugated boxes are a solid choice for businesses looking for reliable and sustainable packaging solutions. These boxes are made from quality packing cardboard, with a fluted inner layer between two flat outer liners. This design provides good strength and rigidity and helps keep your products safe during storage and transit.

We prioritize environmental responsibility. Our corrugated boxes are made using recycled materials and are fully recyclable. By choosing our boxes, you can meet your packaging needs while reducing your environmental impact. The lightweight design of our packing boxes can help reduce shipping costs without compromising durability.

Our corrugated boxes offer a practical solution for a wide range of packaging applications, making them a good choice for those who value both strength and environmental responsibility.

We prioritize both product safety and environmental impact. Our packing boxes are made from recycled materials and are fully recyclable, supporting responsible disposal and reducing waste. This approach goes together with the light design of corrugated boxes. By reducing overall box weight, we help lower shipping costs without giving up durability. Our corrugated boxes offer a strong yet eco friendly solution for a wide range of packaging applications. Whether you are a business owner protecting your products or an individual looking for secure storage, our corrugated boxes provide a balance of strength and environmental responsibility.`,
    dimensions: { length: 13, width: 13, depth: 2 },
    rate: 315,
    minOrder: 5,
    quantity: 500,
    sku: "FLAT-13X13",
    price_tiers: [
      { pcs: 5, price: 315 },
      { pcs: 10, price: 630 },
      { pcs: 25, price: 1575 },
      { pcs: 50, price: 3150 },
    ],
    features: [
      "13 x 13 inch, kraft board, 3 ply food grade kraft",
      "Fluted inner layer for strength and rigidity",
      "Made from recycled materials, fully recyclable",
      "Lightweight design, ideal for packing and moving",
    ],
    images: ["/products/product_p_1_1.jpg", "/products/product_p_1_2.jpg"],
  },
  {
    cardboardname: "Flat Box 16 x 16 | Corrugated Box",
    description:
      "16 inch by 16 inch food boxes for sharing larger treats. Wide boxes that comfortably hold a variety of food items. Ideal for bakeries, food shops, and sharing meals. Sturdy and eco friendly.",
    description_long: `Our 16 x 16 inch food boxes are built for sharing larger treats. These wide boxes comfortably hold a variety of food items and are ideal for bakeries, food shops, and anyone who loves to share a delicious meal.

Made from quality cardboard, these boxes offer strong durability and keep your food secure during delivery. The large size allows you to pack everything from small cakes and pizzas to platters of party snacks. No more worrying about crushed pastries or jostled pizza; your food arrives looking just as inviting as it tastes.

Our 16 x 16 inch food boxes have a neat, simple design that suits any culinary creation. The light brown color provides a blank canvas for adding your own touch. Personalize them with stickers, stamps, or custom labels for a presentation that reflects your brand or adds something unique.

We care about the environment as much as we care about great food. These food boxes are made from quality materials, so you can enjoy guilt free packaging. Our 16 x 16 inch flat boxes are an ideal solution for anyone looking for a roomy, sturdy, and eco friendly way to package pizzas or other items. Whether you are a professional chef, a restaurant owner, or simply enjoy sharing homemade food with friends and family, our boxes offer a practical combination of function and style.`,
    dimensions: { length: 16, width: 16, depth: 2 },
    rate: 435,
    minOrder: 5,
    quantity: 500,
    sku: "FLAT-16X16",
    price_tiers: [
      { pcs: 5, price: 435 },
      { pcs: 10, price: 870 },
      { pcs: 25, price: 2175 },
      { pcs: 50, price: 4350 },
    ],
    features: [
      "16 x 16 inch, brown kraft board, 3 ply food grade kraft",
      "Ideal for bakeries, food shops, sharing meals",
      "Neat design, customizable with stickers or labels",
      "Eco friendly, made from quality materials",
    ],
    images: ["/products/product_p_2_1.jpg", "/products/product_p_2_2.jpg"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Tariq Mahmood", rating: 5, comment: "Perfect for our tuck shop. Small meals and pastries pack neatly." },
    { authorName: "Sana Ahmed", rating: 5, comment: "Grab and go boxes are sturdy. No spills during delivery." },
    { authorName: "Imran Khan", rating: 5, comment: "7x7 size is just right for burgers and salads. Good value." },
    { authorName: "Amina Hassan", rating: 5, comment: "Clean design, we add our logo. Customers like the look." },
    { authorName: "Farhan Rashid", rating: 5, comment: "Eco friendly and practical. Will reorder." },
  ],
  [
    { authorName: "Zara Sheikh", rating: 5, comment: "10x10 kraft box is versatile. Use for gifting and storage." },
    { authorName: "Bilal Noor", rating: 5, comment: "Recycled material, recyclable. Good for our brand image." },
    { authorName: "Hina Malik", rating: 5, comment: "Natural kraft takes stamps well. Custom look without extra cost." },
    { authorName: "Waqas Choudhry", rating: 5, comment: "Sturdy and presentable. Using for merchandise and gifts." },
    { authorName: "Sadia Farooq", rating: 5, comment: "Blank canvas for creativity. Very pleased." },
  ],
  [
    { authorName: "Rashid Ali", rating: 5, comment: "12x12 flat box fits shirts and pants perfectly. Easy to assemble." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Great for medium pizza and utensils. Strong kraft paper." },
    { authorName: "Usman Khan", rating: 5, comment: "Using for e-commerce shipping. No damage in transit." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "Room for variety of items. Good for retail and storage." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Eco friendly and durable. Recommended." },
  ],
  [
    { authorName: "Bushra Khan", rating: 5, comment: "13x13 corrugated is strong and light. Good for moving." },
    { authorName: "Junaid Ali", rating: 5, comment: "Recycled and recyclable. Meets our sustainability goals." },
    { authorName: "Sana Parveen", rating: 5, comment: "Fluted design adds rigidity. Items arrive safe." },
    { authorName: "Rizwan Hussain", rating: 5, comment: "Balance of strength and environmental responsibility." },
    { authorName: "Nabeel Sheikh", rating: 5, comment: "Reliable flat box. Will order again." },
  ],
  [
    { authorName: "Samina Abbas", rating: 5, comment: "16x16 perfect for sharing platters and large pizzas." },
    { authorName: "Kashif Mehmood", rating: 5, comment: "Bakeries and food shops will love this size. Sturdy." },
    { authorName: "Nida Hassan", rating: 5, comment: "No crushed pastries. Food arrives looking great." },
    { authorName: "Arsalan Khan", rating: 5, comment: "Custom labels look professional. Good for branding." },
    { authorName: "Saba Riaz", rating: 5, comment: "Roomy, solid, eco friendly. Best flat box for big orders." },
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

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_p_2_1.jpg"]), categoryId);
console.log("  Updated Flat Boxes subcategory image to product_p_2_1.jpg");

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
console.log("\nDone. Seeded 5 Flat Boxes products. Restart dev server and refresh.");
