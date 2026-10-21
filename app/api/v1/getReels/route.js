import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT id, Type, Sizes, description, Quantity FROM reels").all();
    const data = rows.map((r) => ({
      _id: String(r.id),
      Type: r.Type,
      Sizes: typeof r.Sizes === "string" ? JSON.parse(r.Sizes || "[]") : r.Sizes,
      description: r.description,
      Quantity: r.Quantity,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
