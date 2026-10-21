/**
 * Seed Pizza Boxes subcategory with 6 products (6", 8", 10", 12", 13", 16") in ascending order.
 * Also sets the Pizza Boxes subcategory image to product_p_4_1.jpg.
 * Run from project root: node scripts/seed-pizza-boxes-products.js
 * Run after seed-categories and seed-food-restaurant-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const PIZZA_BOX_CATEGORY_NAME = "Pizza Boxes";

// Products in ascending order by size: 6", 8", 10", 12", 13", 16"
const products = [
  {
    cardboardname: "Corrugated Pizza Box 6″ | Custom Pizza Box",
    description:
      "6 inch pizza slice boxes for single slices. Made from strong food-grade kraft board to keep slices fresh and secure during delivery. Ideal for pizzerias and food delivery.",
    description_long: `Our 6 inch pizza slice boxes are built for serving single slices to your customers. Made from durable, food-grade materials, they keep pizza slices fresh and secure during delivery.

For businesses that need larger packaging, our pizza delivery boxes can carry multiple slices or whole small pizzas. The boxes are easy to assemble and feature secure lids so your pizzas are delivered safely.

Our boxes are eco friendly and made from recyclable materials, so they are a sustainable choice for businesses that want to reduce their environmental impact. We focus on reliable packaging that meets your needs, whether you need individual slice boxes or delivery boxes for your pizzas.`,
    dimensions: { length: 6, width: 6, depth: 1.25 },
    rate: 150,
    minOrder: 5,
    quantity: 500,
    sku: "FB-PIZ-6",
    price_tiers: [
      { pcs: 5, price: 150 },
      { pcs: 10, price: 300 },
      { pcs: 25, price: 750 },
      { pcs: 50, price: 1500 },
      { pcs: 100, price: 3000 },
    ],
    features: [
      "6 x 6 inch, brown kraft board",
      "3 ply food-grade kraft (inner and outer)",
      "Ideal for single slices and personal pan",
      "Easy to assemble, secure lid",
    ],
    images: ["/products/product_p_6_1.png", "/products/product_p_6_2.jpg"],
  },
  {
    cardboardname: "Corrugated Pizza Box 8″ | Custom Pizza Box",
    description:
      "8 inch pizza box for small pizzas and bakeries. Food-grade corrugated kraft keeps pizzas warm and fresh. Bulk options with delivery to your kitchen.",
    description_long: `Our 8 inch pizza box is designed with your business in mind. It is perfect for 8 inch pizzas, keeping them warm, fresh, and ready to enjoy.

We understand how important quality and convenience are. Our pizza boxes are made from sturdy food-grade cardboard so your pizza stays safe during delivery or takeaway. The box has a secure lid to prevent spills and leaks, so your pizza arrives in perfect condition.

Our 8 inch pizza box is practical and environmentally friendly. Made from recyclable materials, you can offer great pizza while making a sustainable choice. The boxes are easy to open and close. We also offer custom printing so you can add your branding to your pizza boxes.

Whether you run a pizzeria and need reliable packaging or a bakery selling small pizzas, our 8 inch pizza box is a solid choice.`,
    dimensions: { length: 8, width: 8, depth: 1.5 },
    rate: 200,
    minOrder: 5,
    quantity: 500,
    sku: "FB-PIZ-8",
    price_tiers: [
      { pcs: 5, price: 200 },
      { pcs: 10, price: 400 },
      { pcs: 25, price: 1000 },
      { pcs: 50, price: 2000 },
      { pcs: 100, price: 4000 },
    ],
    features: [
      "8 x 8 inch, brown kraft board",
      "3 ply food-grade kraft (inner and outer)",
      "Suitable for small pizzas and bakeries",
      "Custom printing available",
    ],
    images: ["/products/product_p_3_1.jpg", "/products/product_p_3_2.jpg"],
  },
  {
    cardboardname: "Corrugated Pizza Box 10″ | Custom Pizza Box",
    description:
      "10 inch pizza box to keep your pizza fresh and safe. Strong cardboard and food-grade construction. Eco friendly and easy to use for home or restaurant.",
    description_long: `Our 10 inch pizza box is built to keep your pizza fresh and hot. It is made from strong cardboard so your 10 inch pizza stays delicious until you are ready to eat. It is eco friendly and easy to use, whether you are enjoying pizza at home or need reliable packaging for your restaurant.

We understand the joy of sharing a pizza with friends and family. Our box is designed for convenience and style. Made from durable, food-grade cardboard, it keeps your pizza safe and secure during delivery or takeaway.

Our 10 inch pizza box is practical and environmentally conscious. Made from recyclable materials, you can enjoy your pizza knowing you are making a sustainable choice. The design is easy to open and close. With custom printing options, you can personalize your pizza boxes to match your brand.

Whether you are a pizza lover at home or a restaurant owner in need of reliable packaging, our 10 inch pizza box is a great choice.`,
    dimensions: { length: 10, width: 10, depth: 1.5 },
    rate: 230,
    minOrder: 5,
    quantity: 500,
    sku: "FB-PIZ-10",
    price_tiers: [
      { pcs: 5, price: 230 },
      { pcs: 10, price: 460 },
      { pcs: 25, price: 1150 },
      { pcs: 50, price: 2300 },
      { pcs: 100, price: 4600 },
    ],
    features: [
      "10 x 10 inch, brown kraft board",
      "3 ply food-grade kraft (inner and outer)",
      "Keeps pizza warm and fresh",
      "Custom printing available",
    ],
    images: ["/products/product_p_5_1.jpg", "/products/product_p_5_2.jpg"],
  },
  {
    cardboardname: "Corrugated Pizza Box 12″ | Custom Pizza Box",
    description:
      "12 inch pizza box for your pizza business. Bulk 12 inch options delivered to your kitchen. Corrugated cardboard for stability and durability.",
    description_long: `A great pizza delivery experience is about more than the food. It is about the moment of arrival and the excitement of opening a piping hot pizza. Our 12 inch pizza box is built so your pizzas arrive looking and tasting their best.

Our boxes are made from quality corrugated cardboard and designed to give the best protection. They support the weight of a fully loaded pizza without breaking or losing shape, so the crust stays crisp when it arrives.

Our 12 inch boxes are more than strong packaging. Presentation matters. The boxes have a neat, finished look and protect your pizza. Your customers get a well presented box that sets the scene for a great pizza experience.

Whether you run a pizzeria or are sending a homemade pizza to a friend, our 12 inch box gives you peace of mind. You can focus on making delicious pizzas, knowing they will arrive in great condition.`,
    dimensions: { length: 12, width: 12, depth: 1.75 },
    rate: 250,
    minOrder: 5,
    quantity: 500,
    sku: "FB-PIZ-12",
    price_tiers: [
      { pcs: 5, price: 250 },
      { pcs: 10, price: 500 },
      { pcs: 25, price: 1250 },
      { pcs: 50, price: 2500 },
      { pcs: 100, price: 5000 },
    ],
    features: [
      "12 x 12 inch, brown kraft board",
      "3 ply food-grade kraft (inner and outer)",
      "Strong construction for delivery",
      "Neat, finished appearance",
    ],
    images: ["/products/product_p_4_1.jpg", "/products/product_p_4_2.jpg"],
  },
  {
    cardboardname: "Corrugated Pizza Box 13″ | Custom Pizza Box",
    description:
      "Durable 13 inch pizza boxes at affordable prices. Premium corrugated kraft, food-grade. Wholesale options for restaurants and small pizza shops.",
    description_long: `Looking for durable pizza boxes for your restaurant at a good price? We offer 13 inch pizza boxes and wholesale options to meet your packaging needs.

Our 13 inch pizza boxes are designed to hold your pizzas securely while keeping them fresh and tasty. Made from durable material, they are ideal for delivery or takeaway so your pizzas arrive hot and intact.

When you choose us for your pizza box needs, you get reliable quality at wholesale prices. Whether you need a small quantity for an event or a large order for your restaurant, we can help.

Our wholesale pizza boxes suit businesses that want to stock up on packaging without overspending. With bulk pricing, you can order the quantity you need at a price that fits your budget.

We know that presentation and performance matter for packaging. We offer personalization options so you can create the right pizza boxes for your brand. From custom printing to different sizes and shapes, we can help you design packaging that stands out and impresses your customers.`,
    dimensions: { length: 13, width: 13, depth: 1.75 },
    rate: 315,
    minOrder: 5,
    quantity: 500,
    sku: "FB-PIZ-13",
    price_tiers: [
      { pcs: 5, price: 315 },
      { pcs: 10, price: 630 },
      { pcs: 25, price: 1575 },
      { pcs: 50, price: 3150 },
    ],
    features: [
      "13 x 13 inch, brown kraft board",
      "3 ply food-grade kraft (inner and outer)",
      "Wholesale and bulk pricing",
      "Custom printing available",
    ],
    images: ["/products/product_p_1_1.jpg", "/products/product_p_1_2.jpg"],
  },
  {
    cardboardname: "Corrugated Pizza Box 16″ | Custom Pizza Box",
    description:
      "16 inch corrugated pizza boxes for delivery, takeaway, or dine-in. High-quality construction and custom options for your branding.",
    description_long: `We offer a wide range of packaging for the pizza industry, including corrugated 16 inch pizza boxes and custom options to fit your needs.

Our corrugated pizza boxes are made from high-quality materials for durability and strength. They provide reliable packaging for your 16 inch pizzas. Whether you run a small pizzeria or a larger restaurant chain, our boxes are designed to meet your requirements.

Besides standard corrugated pizza boxes, we offer custom pizza boxes that can be tailored to your branding and design. With custom printing, you can add your logo, brand colors, and other details so your pizzas are delivered in packaging that reflects your brand.

We understand how important presentation and effectiveness are when it comes to packaging. We offer a range of customization options so you can create the right pizza boxes for your business. Whether you need boxes for delivery, takeaway, or dine-in, we are here to help.

When you choose us for your pizza box needs, you get quality products at competitive prices. Our team is committed to customer service and helping you get the packaging solutions you need. For durable, customizable pizza boxes, get in touch to learn more about our options.`,
    dimensions: { length: 16, width: 16, depth: 2 },
    rate: 435,
    minOrder: 5,
    quantity: 500,
    sku: "FB-PIZ-16",
    price_tiers: [
      { pcs: 5, price: 435 },
      { pcs: 10, price: 870 },
      { pcs: 25, price: 2175 },
      { pcs: 50, price: 4350 },
    ],
    features: [
      "16 x 16 inch, brown kraft board",
      "3 ply food-grade kraft (inner and outer)",
      "Custom printing and branding",
      "For delivery, takeaway, and dine-in",
    ],
    images: ["/products/product_p_2_1.jpg", "/products/product_p_2_2.jpg"],
  },
];

const reviewsByProduct = [
  [
    { authorName: "Tariq Mahmood", rating: 5, comment: "Perfect for single slices. Sturdy and no grease through." },
    { authorName: "Sana Ahmed", rating: 5, comment: "Great value in bulk. Our slice counter loves them." },
    { authorName: "Imran Khan", rating: 5, comment: "Small size is ideal. Easy to stack and store." },
    { authorName: "Amina Hassan", rating: 5, comment: "Customers get a neat box every time. Will reorder." },
    { authorName: "Farhan Rashid", rating: 5, comment: "Good quality for the price. No complaints." },
  ],
  [
    { authorName: "Zara Sheikh", rating: 5, comment: "Fits our 8 inch pizzas perfectly. Reliable." },
    { authorName: "Bilal Noor", rating: 5, comment: "Bulk order was delivered on time. Boxes are strong." },
    { authorName: "Hina Malik", rating: 5, comment: "Using for our bakery pizzas. Works great." },
    { authorName: "Waqas Choudhry", rating: 5, comment: "Easy to close and open. Good presentation." },
    { authorName: "Sadia Farooq", rating: 5, comment: "Eco friendly and sturdy. Recommended." },
  ],
  [
    { authorName: "Rashid Ali", rating: 5, comment: "10 inch box keeps pizza hot. Very satisfied." },
    { authorName: "Nadia Hussain", rating: 5, comment: "We use these for delivery. No crushed boxes." },
    { authorName: "Usman Khan", rating: 5, comment: "Custom print looked professional. Happy with order." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "Good thickness. Pizzas arrive in shape." },
    { authorName: "Kamran Abbas", rating: 5, comment: "Best 10 inch option we have found. Reordering." },
  ],
  [
    { authorName: "Saima Riaz", rating: 5, comment: "12 inch is our main size. Quality is consistent." },
    { authorName: "Haris Mahmood", rating: 5, comment: "Crust stays crisp in delivery. Great box." },
    { authorName: "Lubna Ahmed", rating: 5, comment: "Neat finish. Customers comment on the packaging." },
    { authorName: "Asad Iqbal", rating: 5, comment: "Bulk price is fair. Will stick with this supplier." },
    { authorName: "Zeeshan Malik", rating: 5, comment: "No complaints. Does the job well." },
  ],
  [
    { authorName: "Bushra Khan", rating: 5, comment: "13 inch fits our large personal size. Good quality." },
    { authorName: "Junaid Ali", rating: 5, comment: "Wholesale rate helped our margins. Thank you." },
    { authorName: "Sana Parveen", rating: 5, comment: "Delivery was quick. Boxes as described." },
    { authorName: "Rizwan Hussain", rating: 5, comment: "We use for takeaway. Holds heat well." },
    { authorName: "Nabeel Sheikh", rating: 5, comment: "Reliable and affordable. Recommended for pizzerias." },
  ],
  [
    { authorName: "Samina Abbas", rating: 5, comment: "16 inch for our family size. Strong and sturdy." },
    { authorName: "Kashif Mehmood", rating: 5, comment: "Custom branding looked great. Professional." },
    { authorName: "Nida Hassan", rating: 5, comment: "Big orders for our chain. No issues." },
    { authorName: "Arsalan Khan", rating: 5, comment: "Best large pizza box we have used. Will reorder." },
    { authorName: "Saba Riaz", rating: 5, comment: "Stacks well in the kitchen. Good value." },
  ],
];

const reviewDates = [
  "2024-03-12 10:00:00", "2024-06-20 14:30:00", "2024-09-05 09:15:00", "2025-01-08 11:45:00", "2025-04-22 16:00:00",
  "2024-04-18 08:30:00", "2024-07-10 13:00:00", "2024-10-28 10:20:00", "2025-02-14 15:30:00", "2025-05-10 09:00:00",
  "2024-05-02 11:00:00", "2024-08-15 14:00:00", "2024-11-20 08:45:00", "2025-03-05 12:00:00", "2025-06-18 10:30:00",
  "2024-05-25 09:30:00", "2024-09-12 16:00:00", "2024-12-08 11:15:00", "2025-03-28 14:45:00", "2025-07-02 08:00:00",
  "2024-06-08 14:20:00", "2024-10-01 10:00:00", "2025-01-20 13:30:00", "2025-04-15 09:45:00", "2025-08-10 15:00:00",
  "2024-07-22 11:30:00", "2024-11-15 08:00:00", "2025-02-28 16:20:00", "2025-05-25 10:15:00", "2025-09-05 12:45:00",
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories/subcategories first.");
  process.exit(1);
}

const db = new Database(dbPath);

const catRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ? AND parent_id IS NOT NULL").get(PIZZA_BOX_CATEGORY_NAME);
if (!catRow) {
  console.error("Subcategory '" + PIZZA_BOX_CATEGORY_NAME + "' not found. Run seed-food-restaurant-subcategories.js first.");
  db.close();
  process.exit(1);
}

const categoryId = catRow.id;

db.prepare("DELETE FROM product_reviews WHERE productId IN (SELECT id FROM products WHERE mainType = ?)").run(categoryId);
db.prepare("DELETE FROM products WHERE mainType = ?").run(categoryId);

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/product_p_4_1.jpg"]), categoryId);
console.log("  Updated Pizza Boxes subcategory image to product_p_4_1.jpg");

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
console.log("\nDone. Seeded 6 Pizza Boxes products (6\", 8\", 10\", 12\", 13\", 16\") and set subcategory image. Restart dev server and refresh.");
