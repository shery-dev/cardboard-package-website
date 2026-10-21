import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const db = getDb();
    const r = db
      .prepare(
        "SELECT id, mainType, cardboardname, description, rate, quantity, minOrder, dimensions, images, sku, price_tiers, description_long, features FROM products WHERE id = ?"
      )
      .get(id);
    if (!r) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    let reviews = [];
    try {
      reviews = db
        .prepare("SELECT id, authorName, rating, comment, createdAt FROM product_reviews WHERE productId = ? ORDER BY createdAt DESC")
        .all(id);
    } catch (_) {}

    let categoryName = "";
    try {
      const cat = db.prepare("SELECT cardboardname FROM categories WHERE id = ?").get(r.mainType);
      if (cat) categoryName = cat.cardboardname;
    } catch (_) {}

    const data = [
      {
        _id: String(r.id),
        categoryName: categoryName,
        mainType: r.mainType,
        cardboardname: r.cardboardname,
        description: r.description || "",
        rate: r.rate,
        quantity: r.quantity ?? 0,
        minOrder: r.minOrder,
        dimensions: typeof r.dimensions === "string" ? JSON.parse(r.dimensions || "{}") : r.dimensions,
        images: typeof r.images === "string" ? JSON.parse(r.images || "[]") : r.images,
        sku: r.sku || null,
        price_tiers: r.price_tiers ? JSON.parse(r.price_tiers) : null,
        description_long: r.description_long || null,
        features: typeof r.features === "string" ? JSON.parse(r.features || "[]") : (r.features || []),
        reviews: reviews.map((rev) => ({
          id: rev.id,
          authorName: rev.authorName,
          rating: rev.rating,
          comment: rev.comment,
          createdAt: rev.createdAt,
        })),
      },
    ];
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
