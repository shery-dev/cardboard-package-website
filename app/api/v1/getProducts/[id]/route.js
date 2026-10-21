import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const db = getDb();
    const childIds = db
      .prepare("SELECT id FROM categories WHERE parent_id = ?")
      .all(categoryId)
      .map((r) => r.id);
    const mainTypeIds = [categoryId, ...childIds];

    const placeholders = mainTypeIds.map(() => "?").join(",");
    const rows = db
      .prepare(
        `SELECT id, mainType, cardboardname, description, rate, quantity, minOrder, dimensions, images, sku, price_tiers, description_long, features FROM products WHERE mainType IN (${placeholders})`
      )
      .all(...mainTypeIds);

    const data = rows.map((r) => ({
      _id: String(r.id),
      mainType: r.mainType,
      cardboardname: r.cardboardname,
      description: r.description || "",
      rate: r.rate,
      quantity: r.quantity ?? 0,
      minOrder: r.minOrder,
      dimensions: typeof r.dimensions === "string" ? JSON.parse(r.dimensions || "{}") : r.dimensions,
      images: typeof r.images === "string" ? JSON.parse(r.images || "[]") : r.images,
      sku: r.sku || null,
      price_tiers: r.price_tiers ? (typeof r.price_tiers === "string" ? JSON.parse(r.price_tiers) : r.price_tiers) : null,
      description_long: r.description_long || null,
      features: r.features ? (typeof r.features === "string" ? JSON.parse(r.features) : r.features) : null,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
