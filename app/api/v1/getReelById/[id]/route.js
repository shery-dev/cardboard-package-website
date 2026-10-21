import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const db = getDb();
    const r = db.prepare("SELECT id, Type, Sizes, description, Quantity FROM reels WHERE id = ?").get(id);
    if (!r) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(
      {
        _id: String(r.id),
        Type: r.Type,
        Sizes: typeof r.Sizes === "string" ? JSON.parse(r.Sizes || "[]") : r.Sizes,
        description: r.description,
        Quantity: r.Quantity,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
