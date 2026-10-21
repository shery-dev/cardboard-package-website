import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ data: [] }, { status: 200 });
    const db = getDb();
    const r = db.prepare("SELECT id, Type, Sizes FROM reels WHERE id = ?").get(id);
    if (!r) return NextResponse.json({ data: [] }, { status: 200 });
    const Sizes = typeof r.Sizes === "string" ? JSON.parse(r.Sizes || "[]") : r.Sizes;
    return NextResponse.json({ data: Array.isArray(Sizes) ? Sizes : [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
