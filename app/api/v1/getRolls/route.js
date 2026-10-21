import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT id, Type, Rate, Sizes, description, Quantity, images FROM rolls").all();
    const data = rows.map((r) => ({
      _id: String(r.id),
      Type: r.Type,
      Rate: r.Rate,
      Sizes: typeof r.Sizes === "string" ? JSON.parse(r.Sizes || "{}") : r.Sizes,
      description: r.description,
      Quantity: r.Quantity,
      images: typeof r.images === "string" ? JSON.parse(r.images || "[]") : r.images,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
