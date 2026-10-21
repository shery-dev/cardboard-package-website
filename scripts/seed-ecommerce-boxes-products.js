/**
 * Seed Ecommerce Boxes subcategory with 12 products. Also sets subcategory image to ecommerce.jpg.
 * Run from project root: node scripts/seed-ecommerce-boxes-products.js
 * Run after seed-categories and seed-corrugated-subcategories.
 */

const path = require("path");
const fs = require("fs");

const dbPath = path.join(process.cwd(), "data", "cardboard.db");
const Database = require("better-sqlite3");

const SUBCATEGORY_NAME = "Ecommerce Boxes";

const products = [
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
    sku: "ECOM-APP-JACKET",
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
    sku: "ECOM-APP-TSHIRT",
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
    sku: "ECOM-FRAME",
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
    cardboardname: "Shipping Box 3 Kg",
    description:
      "Reliable corrugated shipping boxes for parcels up to 3 kg. Durable construction for safe delivery. Easy to assemble. Ideal for small electronics, clothing and accessories.",
    description_long: `We understand the importance of safe and secure shipping. Our packaging box is made from quality corrugated cardboard so your items stay safe in transit and arrive at their destination in one piece.

Our packing box is durable and reliable, suitable for a wide range of items. Whether you ship small electronics, clothing, or accessories, our packaging boxes offer a solid solution. Key features include durable construction from solid corrugated cardboard so the box withstands the rigors of shipping. The boxes are easy to assemble, saving time when preparing packages. We offer customizable options so you can add your logo or branding for a professional finish. Our carton boxes are made from recycled materials, making them an eco friendly choice.`,
    dimensions: { length: 14, width: 10.75, depth: 6.75 },
    rate: 400,
    minOrder: 5,
    quantity: 100,
    sku: "ECOM-SHIP3",
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
    sku: "ECOM-LAPTOP",
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
    sku: "ECOM-PB-03",
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
    cardboardname: "Product Box | 0.5 KG",
    description:
      "Cardboard box 0.5 KG for small items and utensils. Maximum safety and security during transit. Strong construction, eco friendly and recyclable. Ideal for electronics, jewelry and fragile items.",
    description_long: `Our 0.5 KG cardboard box is designed to give your lightweight yet precious items maximum safety and security during transit so your products reach their destination safely and intact.

Made from quality cardboard, our 0.5 KG box offers good strength and can withstand the rigors of shipping and handling, keeping your items safe from damage. This packing box is versatile and can be used for a wide range of applications. Whether you ship electronics, jewelry, or other fragile items, this box is a solid choice.

We are committed to eco friendly packaging. Our 0.5 KG box is made from recyclable materials and is fully recyclable, making it an eco conscious choice for your packaging needs. With its secure design, durable walls, and eco friendly materials, this cardboard box is a reliable packaging solution for your valuable items.`,
    dimensions: { length: 6.5, width: 6.5, depth: 3.5 },
    rate: 312,
    minOrder: 5,
    quantity: 500,
    sku: "ECOM-PB-05",
    price_tiers: [
      { pcs: 5, price: 312 },
      { pcs: 10, price: 625 },
      { pcs: 25, price: 1562 },
      { pcs: 50, price: 3125 },
      { pcs: 100, price: 6250 },
    ],
    features: [
      "6.5 x 6.5 x 3.5 inch, volumetric weight 0.5 KG",
      "3 PLY (Kraft 120 + SF 120 + KL 120), self assembling lock",
      "Ideal for small items and utensils",
      "Eco friendly and recyclable",
    ],
    images: ["/products/product_e_5_1.jpg", "/products/product_e_5_2.jpg"],
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
    sku: "ECOM-PB-1",
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
    sku: "ECOM-GIFT",
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
    sku: "ECOM-MUG",
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
    cardboardname: "Packing Box | For Shoes",
    description:
      "Shoe packing box for durability and style. Protects footwear from dirt and damage. Sleek design with transparent front for easy viewing. Ideal for all shoe types. Eco friendly materials. Order yours today.",
    description_long: `Our shoe packing box is designed with both functionality and style in mind, giving you a practical way to keep your footwear in perfect condition and add a touch of order to your storage space. Whether you are a sneaker enthusiast with a large collection, a fashion lover, or someone looking for a smarter way to store shoes, our packing box is a solid choice.

Your shoes deserve good care. Our shoe packing box is made from quality, sturdy materials that protect your footwear from dirt and damage. The robust construction helps your shoes keep their shape and appearance whether in long-term storage or waiting for their next wear. The box has a clean, modern design that fits any decor. With a transparent front panel, you can see the contents without opening the box, making it easy to find the right pair. Our packing box is not only for shoes. Its design works well for storing accessories, small clothing, or craft supplies. The modular design allows for easy stacking and organization. The box has a user-friendly design with a hinged lid that opens smoothly for quick access. Our shoe packing box is made from eco friendly materials that are recyclable and biodegradable. Available in multiple sizes to suit various shoe types, from high heels to sneakers.`,
    dimensions: { length: 12.8, width: 8.5, depth: 5 },
    rate: 650,
    minOrder: 5,
    quantity: 500,
    sku: "ECOM-SHOES",
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
    sku: "ECOM-CARTON",
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
];

const reviewsByProduct = [
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
    { authorName: "Saima Riaz", rating: 5, comment: "Right size for small parcels. Easy to assemble and ship." },
    { authorName: "Haris Mahmood", rating: 5, comment: "Durable 3 ply. Electronics and clothes ship safely." },
    { authorName: "Lubna Ahmed", rating: 5, comment: "Good value and quality. Using for our online store." },
    { authorName: "Asad Iqbal", rating: 5, comment: "Lightweight but strong. No damaged deliveries so far." },
    { authorName: "Zeeshan Malik", rating: 5, comment: "Reliable shipping box. Will reorder." },
  ],
  [
    { authorName: "Bushra Khan", rating: 5, comment: "Laptop arrived safe. Perfect fit and soft lining inside." },
    { authorName: "Junaid Ali", rating: 5, comment: "We use for repairs and gifting. Sturdy and professional." },
    { authorName: "Sana Parveen", rating: 5, comment: "Multiple sizes available. No more oversized boxes." },
    { authorName: "Rizwan Hussain", rating: 5, comment: "Great for storage too. Keeps dust off when not in use." },
    { authorName: "Nabeel Sheikh", rating: 5, comment: "Best laptop box we have used. Recommended." },
  ],
  [
    { authorName: "Samina Abbas", rating: 5, comment: "Perfect for jewelry and cosmetics. Sleek and customizable." },
    { authorName: "Kashif Mehmood", rating: 5, comment: "Self assembling lock is handy. Quick to set up." },
    { authorName: "Nida Hassan", rating: 5, comment: "Small but sturdy. Great for small treasures and gifts." },
    { authorName: "Arsalan Khan", rating: 5, comment: "Eco friendly and good quality. Branding looked sharp." },
    { authorName: "Saba Riaz", rating: 5, comment: "Ideal for organizing inventory. Will order again." },
  ],
  [
    { authorName: "Fahad Khan", rating: 5, comment: "0.5 KG box is just right for small electronics. Sturdy." },
    { authorName: "Ayesha Siddiqui", rating: 5, comment: "Recyclable and strong. No damage in transit." },
    { authorName: "Zeeshan Ali", rating: 5, comment: "Good for jewelry and fragile items. Reliable." },
    { authorName: "Mariam Ahmed", rating: 5, comment: "Bulk order was well packed. Happy with quality." },
    { authorName: "Saad Mahmood", rating: 5, comment: "Eco conscious choice. Does the job well." },
  ],
  [
    { authorName: "Hina Farooq", rating: 5, comment: "Perfect for single shoes and clothing. Strong 1 KG box." },
    { authorName: "Umer Rashid", rating: 5, comment: "Easy to stack. Using for our ecommerce shipments." },
    { authorName: "Nida Hassan", rating: 5, comment: "Recyclable material. Good value for the size." },
    { authorName: "Arsalan Sheikh", rating: 5, comment: "No complaints. Arrives flat, assembles quickly." },
    { authorName: "Saba Riaz", rating: 5, comment: "Ideal for apparel and shoes. Recommended." },
  ],
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
    { authorName: "Nida Hassan", rating: 5, comment: "Shoe box with clear front is genius. Easy to find pairs." },
    { authorName: "Arsalan Sheikh", rating: 5, comment: "Sturdy and eco friendly. Sneaker collection looks tidy." },
    { authorName: "Saba Riaz", rating: 5, comment: "Perfect size for all shoe types. No damage in shipping." },
    { authorName: "Fahad Khan", rating: 5, comment: "Bulk order for our store. Quality consistent." },
    { authorName: "Ayesha Siddiqui", rating: 5, comment: "Modern design and strong. Will reorder." },
  ],
  [
    { authorName: "Zeeshan Ali", rating: 5, comment: "10x10x10 cube is versatile. Use for storage and shipping." },
    { authorName: "Mariam Ahmed", rating: 5, comment: "Strong multi-ply. Interlocking flaps hold well." },
    { authorName: "Saad Mahmood", rating: 5, comment: "Good for documents and merchandise. Reliable." },
    { authorName: "Hina Farooq", rating: 5, comment: "Lightweight but durable. Fair price in bulk." },
    { authorName: "Umer Rashid", rating: 5, comment: "Packing carton box does the job. Recommended." },
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
  "2024-10-22 08:30:00", "2025-02-05 14:30:00", "2025-05-18 11:00:00", "2025-08-28 09:15:00", "2025-12-10 13:45:00",
  "2024-11-08 12:00:00", "2025-03-15 10:30:00", "2025-06-22 15:00:00", "2025-09-18 08:00:00", "2026-01-05 11:20:00",
  "2024-12-02 09:45:00", "2025-04-25 14:00:00", "2025-07-12 10:15:00", "2025-10-05 13:30:00", "2026-02-12 09:00:00",
  "2025-01-22 11:00:00", "2025-05-08 08:30:00", "2025-08-15 14:45:00", "2025-11-20 10:00:00", "2026-03-08 15:30:00",
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

db.prepare("UPDATE categories SET img = ? WHERE id = ?").run(JSON.stringify(["/products/ecommerce.jpg"]), categoryId);
console.log("  Updated Ecommerce Boxes subcategory image to ecommerce.jpg");

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
console.log("\nDone. Seeded 12 Ecommerce Boxes products and set subcategory image. Restart dev server and refresh.");
