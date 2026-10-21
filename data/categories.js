/**
 * Product categories for navbar and product showcase.
 * Used by Navbar dropdown and ProductsShowcaseSection.
 * Add your own images to /public/img/categories/ (e.g. ration.png, food-restaurant.png).
 */

export const CATEGORIES = [
  {
    _id: "ration-packaging-boxes",
    cardboardname: "Ration Packaging Boxes",
    description: "Sturdy ration and grocery packaging boxes for safe storage and transport. Ideal for bulk food items, pantry goods, and wholesale distribution with strength and durability for handling.",
    img: ["/img/logo.svg"],
    features: [
      "Strong, durable construction for heavy items",
      "Ideal for bulk and wholesale distribution",
      "Safe storage and easy carriage",
    ],
  },
  {
    _id: "food-restaurant",
    cardboardname: "Food & Restaurant",
    description: "Food-safe packaging for restaurants and takeaways: pizza boxes, cake boxes, custom pizza slice boxes, and general food packaging. Grease-resistant and designed for fresh and prepared food.",
    img: ["/img/logo.svg"],
    features: [
      "Pizza boxes, cake boxes, and food packaging",
      "Food-safe and grease-resistant materials",
      "Custom sizes for slices and portions",
    ],
  },
  {
    _id: "corrugated-boxes",
    cardboardname: "Corrugated Boxes",
    description: "Versatile corrugated boxes for e-commerce, apparel, gifts, laptops, tools, and corporate use. Ecommerce boxes, flat boxes, apparel boxes, gift box packaging, laptop boxes, tool boxes, cube boxes, and corporate boxes.",
    img: ["/img/logo.svg"],
    features: [
      "Ecommerce, apparel, gift box, and laptop boxes",
      "Flat, cube, and corporate options",
      "Protection and branding in one",
    ],
  },
  {
    _id: "cartons",
    cardboardname: "Cartons",
    description: "Carton boxes for shipping, moving, and storage. From small paper cartons to large shipping cartons—strong, recyclable, and suited to every packaging need at home or for business.",
    img: ["/img/logo.svg"],
    features: [
      "Shipping and moving cartons",
      "Multiple sizes for any need",
      "Eco-friendly and recyclable",
    ],
  },
];

/** Subcategories for navbar dropdown */
export const CATEGORY_SUBMENUS = {
  "food-restaurant": [
    { name: "Pizza Boxes", id: "food-restaurant" },
    { name: "Cake Boxes", id: "food-restaurant" },
    { name: "Food Packaging Boxes", id: "food-restaurant" },
  ],
  "corrugated-boxes": [
    { name: "Ecommerce Boxes", id: "corrugated-boxes" },
    { name: "Flat Boxes", id: "corrugated-boxes" },
    { name: "Apparel Boxes", id: "corrugated-boxes" },
    { name: "Gift Box Packaging", id: "corrugated-boxes" },
    { name: "Laptop Boxes", id: "corrugated-boxes" },
    { name: "Tool Boxes", id: "corrugated-boxes" },
    { name: "Cube Boxes", id: "corrugated-boxes" },
    { name: "Corporate Boxes", id: "corrugated-boxes" },
  ],
};
