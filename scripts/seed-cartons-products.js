/**
 * Seed Cartons category: 4 products (same as ration, different names) + 6 additional carton products.
 * Run from project root: node scripts/seed-cartons-products.js
 * Run seed:categories first so "Cartons" exists.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const CARTONS_CATEGORY_NAME = "Cartons";

// Same 4 products as ration, only cardboardname and sku differ. Order: 16", 18"(12x12), 18"(18x14), 20"
const products = [
  {
    cardboardname: "Carton Box 16″ | Ration Packaging Box (16×10×9 In)",
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
  },
  {
    cardboardname: "Carton Box 18″ | Ration Packaging Box (18×12×12 In)",
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
  },
  {
    cardboardname: "Carton Box 18″ | Ration Packaging Box (18×18×14 In)",
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
  },
  {
    cardboardname: "Carton Box 20″ | Ration Packaging Box (20×14×12 In)",
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
  },
  // New carton-only products (5–10)
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
    sku: "CART-UNIV-151210",
    price_tiers: JSON.stringify([
      { pcs: 1, price: 375 },
      { pcs: 2, price: 750 },
      { pcs: 5, price: 1875 },
    ]),
    features: JSON.stringify([
      "Universal box with lid and hand inserts",
      "Brown color, 5 PLY pressed (KL 150 x 2 + SF 120 x 3)",
      "Sturdy, convenient, and eco friendly",
      "Ideal for shipping, storage, and organization",
    ]),
    images: JSON.stringify(["/products/product_c_1_1.png", "/products/product_c_1_2.png"]),
  },
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
    sku: "CART-EGG6",
    price_tiers: JSON.stringify([
      { pcs: 5, price: 100 },
      { pcs: 10, price: 200 },
      { pcs: 25, price: 480 },
      { pcs: 50, price: 900 },
      { pcs: 100, price: 1750 },
    ]),
    features: JSON.stringify([
      "Built in separation for eggs to prevent collision",
      "3 PLY Corrugated Kraft board, brown color",
      "Ideal for retailers, shop owners, marts and supermarkets",
      "Compact size for refrigerator storage",
    ]),
    images: JSON.stringify(["/products/product_c_2_1.png", "/products/product_c_2_2.png"]),
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
    sku: "CART-EGG12",
    price_tiers: JSON.stringify([
      { pcs: 5, price: 150 },
      { pcs: 10, price: 300 },
      { pcs: 25, price: 700 },
      { pcs: 50, price: 1300 },
      { pcs: 100, price: 2500 },
    ]),
    features: JSON.stringify([
      "Built in separation for eggs to prevent collision",
      "3 PLY Corrugated Kraft board, brown color",
      "Ideal for retailers, shop owners, and marts",
      "Twelve individual slots for maximum protection",
    ]),
    images: JSON.stringify(["/products/product_c_3_1.png", "/products/product_c_3_2.png"]),
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
    sku: "CART-FRAME-20184",
    price_tiers: JSON.stringify([
      { pcs: 5, price: 925 },
      { pcs: 10, price: 1800 },
      { pcs: 15, price: 2700 },
      { pcs: 20, price: 3600 },
    ]),
    features: JSON.stringify([
      "Custom dimensions to fit your artwork perfectly",
      "5 PLY (KL 120 x 2 + SF 120 x 3), brown color",
      "Volumetric weight 5 KG, protective inserts available",
      "Eco friendly materials, optional custom printing",
    ]),
    images: JSON.stringify(["/products/product_c_4_1.jpg", "/products/product_c_4_2.jpg"]),
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
    sku: "CART-SHIP3",
    price_tiers: JSON.stringify([
      { pcs: 5, price: 400 },
      { pcs: 10, price: 800 },
      { pcs: 15, price: 1155 },
      { pcs: 20, price: 1500 },
    ]),
    features: JSON.stringify([
      "Volumetric weight 3 KG, brown color",
      "3 PLY (Kraft 160 x 2 + SF 120 x 1)",
      "Durable construction, easy to assemble",
      "Eco friendly recycled materials",
    ]),
    images: JSON.stringify(["/products/product_c_5_1.png", "/products/product_c_5_2.png"]),
  },
  {
    cardboardname: "Shipping Box 10 Kg",
    description:
      "A wide range of best quality packing boxes and cartons for all your home shifting and moving needs. From sturdy cardboard boxes to versatile packing cartons, find the perfect solution to safeguard your belongings during carriage.",
    description_long: `Our packing boxes redefine the packaging experience. These aren't just ordinary packing boxes; they're a practical solution designed to streamline your packing process.

Crafted for easy packaging, our packing cartons boast a clean aesthetic. Imagine sturdy cartons built from quality materials, featuring clean lines and a modern design. These aren't just boxes; they're an extension of your organized approach.

Our packing cartons are built with the user experience in mind. These cartons feature built in closure systems that eliminate the need for tape or messy adhesives. Simply fold, snap, and ship. It's that easy.

The packing boxes aren't just about protection; they're about making a statement. Our platform allows you to customize your cartons with custom logos or branding design. Make a lasting impression on the receiver. These packaging boxes are the perfect mix of style, innovation, and user friendliness. Experience seamless packing solutions and elevate your shipping experience.`,
    dimensions: { length: 18, width: 18, depth: 10 },
    rate: 330,
    minOrder: 1,
    quantity: 100,
    sku: "CART-SHIP10",
    price_tiers: JSON.stringify([
      { pcs: 1, price: 330 },
      { pcs: 2, price: 660 },
      { pcs: 5, price: 1650 },
    ]),
    features: JSON.stringify([
      "Volumetric weight 10 KG, brown color",
      "5 PLY (KL 120 x 2 + SF 120 x 3)",
      "Ideal for home shifting and moving",
      "Sturdy construction, easy to assemble",
    ]),
    images: JSON.stringify(["/products/product_c_6_1.png", "/products/product_c_6_2.png"]),
  },
];

const reviewsByProduct = [
  [
    { authorName: "Hina Rashid", rating: 5, comment: "Compact and sturdy. Good for small businesses." },
    { authorName: "Tariq Mahmood", rating: 5, comment: "Perfect size for our kitchen supplies. Good value." },
    { authorName: "Sadia Iqbal", rating: 5, comment: "Clean finish and easy to assemble. Happy with purchase." },
    { authorName: "Faisal Khan", rating: 5, comment: "Quality boxes at a fair price. Will reorder." },
    { authorName: "Nadia Hussain", rating: 5, comment: "Ideal for dates and dry goods. Very pleased." },
  ],
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
    { authorName: "Kamran Ali", rating: 5, comment: "Spacious and strong. Perfect for 20–25 kg loads." },
    { authorName: "Sara Khan", rating: 5, comment: "Great for wholesale ration packing. Durable material." },
    { authorName: "Rashid Mehmood", rating: 5, comment: "Exactly what we needed. Good service and product." },
    { authorName: "Maria Siddiqui", rating: 5, comment: "High quality and reliable. No complaints." },
    { authorName: "Adnan Choudhry", rating: 5, comment: "Best 20 inch ration box we have found. Recommended." },
  ],
  // Universal Carton
  [
    { authorName: "Farhan Akhtar", rating: 5, comment: "Sturdy and easy to assemble. Lid and hand inserts are very handy." },
    { authorName: "Saima Riaz", rating: 5, comment: "Perfect for storage and shipping. Good value for the price." },
    { authorName: "Waqas Ahmed", rating: 5, comment: "Strong 5 ply construction. Items arrived safe every time." },
    { authorName: "Amina Sheikh", rating: 5, comment: "Clean finish and stackable. Using for office organization." },
    { authorName: "Haris Mahmood", rating: 5, comment: "Reliable universal carton. Will order again." },
  ],
  // Egg Box 6 Pieces
  [
    { authorName: "Bushra Khan", rating: 5, comment: "Compact and secure. Eggs never break in the fridge." },
    { authorName: "Junaid Malik", rating: 5, comment: "Ideal for our small shop. Customers like the presentation." },
    { authorName: "Sana Parveen", rating: 5, comment: "Individual slots work great. Good quality kraft board." },
    { authorName: "Rizwan Hussain", rating: 5, comment: "Eco friendly and sturdy. Perfect for 6 eggs." },
    { authorName: "Zara Ali", rating: 5, comment: "Exactly what we needed for retail. Fast delivery." },
  ],
  // Egg Box 12 Pieces
  [
    { authorName: "Asad Iqbal", rating: 5, comment: "Best 12 piece egg box we have used. No breakage at all." },
    { authorName: "Hira Noor", rating: 5, comment: "Great for our mart. Sturdy and presentable." },
    { authorName: "Salman Rashid", rating: 5, comment: "Food grade and recyclable. Very satisfied." },
    { authorName: "Lubna Ahmed", rating: 5, comment: "Slots hold eggs firmly. Good for farmers and retailers." },
    { authorName: "Hamza Choudhry", rating: 5, comment: "Durable and reliable. Ordering in bulk next time." },
  ],
  // Frame Carton
  [
    { authorName: "Nabeel Khan", rating: 5, comment: "Perfect fit for our frames. Artwork arrived without a scratch." },
    { authorName: "Samina Abbas", rating: 5, comment: "Custom size option is great. Strong 5 ply protection." },
    { authorName: "Kashif Mehmood", rating: 5, comment: "Ideal for mirrors and artwork. Professional packaging." },
    { authorName: "Sadia Farooq", rating: 5, comment: "Secure and easy to pack. Will use for all our frame shipments." },
    { authorName: "Tahir Malik", rating: 5, comment: "Best frame cartons we have found. Highly recommend." },
  ],
  // Shipping Box 3 Kg
  [
    { authorName: "Nida Hassan", rating: 5, comment: "Right size for small parcels. Easy to assemble and ship." },
    { authorName: "Arsalan Sheikh", rating: 5, comment: "Durable 3 ply. Electronics and clothes ship safely." },
    { authorName: "Saba Riaz", rating: 5, comment: "Good value and quality. Using for our online store." },
    { authorName: "Fahad Khan", rating: 5, comment: "Lightweight but strong. No damaged deliveries so far." },
    { authorName: "Ayesha Siddiqui", rating: 5, comment: "Reliable shipping box. Will reorder." },
  ],
  // Shipping Box 10 Kg
  [
    { authorName: "Zeeshan Ali", rating: 5, comment: "Perfect for home shifting. Heavy duty and stackable." },
    { authorName: "Mariam Ahmed", rating: 5, comment: "Best packing cartons for moving. Sturdy 5 ply." },
    { authorName: "Saad Mahmood", rating: 5, comment: "Great size for 10 kg loads. Easy to close and tape." },
    { authorName: "Hina Farooq", rating: 5, comment: "Used for office relocation. No complaints at all." },
    { authorName: "Umer Rashid", rating: 5, comment: "Quality boxes at fair price. Recommended for movers." },
  ],
];

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at", dbPath, ". Run the app once and seed categories first.");
  process.exit(1);
}

const db = new Database(dbPath);

// Resolve Cartons category id by name
const catRow = db.prepare("SELECT id FROM categories WHERE cardboardname = ?").get(CARTONS_CATEGORY_NAME);
if (!catRow) {
  console.error(
    "Category '" + CARTONS_CATEGORY_NAME + "' not found. Run 'npm run seed:categories' first, then run this script again."
  );
  db.close();
  process.exit(1);
}
const CARTONS_MAIN_TYPE = catRow.id;
console.log("Using category id", CARTONS_MAIN_TYPE, "for", CARTONS_CATEGORY_NAME);

// Delete existing cartons products so we can re-seed cleanly
db.prepare("DELETE FROM product_reviews WHERE productId IN (SELECT id FROM products WHERE mainType = ?)").run(CARTONS_MAIN_TYPE);
db.prepare("DELETE FROM products WHERE mainType = ?").run(CARTONS_MAIN_TYPE);

const insertProduct = db.prepare(`
  INSERT INTO products (mainType, cardboardname, description, rate, quantity, minOrder, dimensions, images, sku, price_tiers, description_long, features)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertReview = db.prepare(`
  INSERT INTO product_reviews (productId, authorName, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?)
`);

const reviewDates = [
  "2024-02-15 10:30:00", "2024-06-22 14:00:00", "2025-01-08 09:15:00", "2025-08-19 11:45:00", "2026-02-03 16:20:00",
  "2024-03-10 08:00:00", "2024-09-05 13:30:00", "2025-04-12 10:00:00", "2025-11-20 15:45:00", "2026-01-14 09:00:00",
  "2024-05-18 11:00:00", "2024-12-01 14:30:00", "2025-02-28 08:45:00", "2025-07-07 12:00:00", "2026-03-02 10:30:00",
  "2024-01-25 09:30:00", "2024-10-12 16:00:00", "2025-05-30 11:15:00", "2025-12-15 13:00:00", "2026-02-18 08:00:00",
  "2024-02-01 09:00:00", "2024-07-14 14:20:00", "2025-03-22 11:30:00", "2025-09-08 16:00:00", "2026-01-05 10:45:00",
  "2024-04-10 08:30:00", "2024-08-28 13:00:00", "2025-02-15 15:20:00", "2025-10-02 09:45:00", "2026-02-22 12:00:00",
  "2024-05-05 11:00:00", "2024-11-18 14:45:00", "2025-04-28 08:15:00", "2025-12-01 10:30:00", "2026-03-10 15:00:00",
  "2024-01-12 10:00:00", "2024-09-20 16:30:00", "2025-05-15 09:00:00", "2025-11-08 13:45:00", "2026-01-28 11:20:00",
  "2024-03-28 14:00:00", "2024-10-05 09:30:00", "2025-06-12 12:45:00", "2025-12-20 08:00:00", "2026-02-14 16:00:00",
  "2024-06-08 11:45:00", "2024-12-22 15:30:00", "2025-01-18 10:00:00", "2025-07-25 14:15:00", "2026-03-05 09:30:00",
];

const productIds = [];
for (const p of products) {
  const dims = p.dimensions;
  insertProduct.run(
    CARTONS_MAIN_TYPE,
    p.cardboardname,
    p.description,
    p.rate,
    p.quantity,
    p.minOrder,
    JSON.stringify(dims),
    p.images,
    p.sku,
    p.price_tiers,
    p.description_long,
    p.features
  );
  productIds.push(db.prepare("SELECT last_insert_rowid() as id").get().id);
  console.log("  +", p.cardboardname, "| SKU:", p.sku);
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
console.log("\nDone. Seeded 10 cartons products with reviews. Restart dev server and refresh.");
