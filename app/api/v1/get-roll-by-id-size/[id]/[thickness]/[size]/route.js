import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ data: null }, { status: 200 });
    const db = getDb();
    const r = db.prepare("SELECT id, Type, Rate, Sizes, description, Quantity, images FROM rolls WHERE id = ?").get(id);
    if (!r) return NextResponse.json({ data: null }, { status: 200 });
    return NextResponse.json(
      {
        data: {
          _id: String(r.id),
          Type: r.Type,
          Rate: r.Rate,
          Sizes: typeof r.Sizes === "string" ? JSON.parse(r.Sizes || "{}") : r.Sizes,
          description: r.description,
          Quantity: r.Quantity,
          images: typeof r.images === "string" ? JSON.parse(r.images || "[]") : r.images,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
