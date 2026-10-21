import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const body = await request.json();
    const db = getDb();
    const r = db.prepare("SELECT Sizes FROM rolls WHERE id = ?").get(id);
    if (!r) return NextResponse.json({ message: "Roll not found" }, { status: 404 });
    const Sizes = typeof r.Sizes === "string" ? JSON.parse(r.Sizes || "{}") : r.Sizes;
    db.prepare("UPDATE rolls SET Sizes = ? WHERE id = ?").run(JSON.stringify({ ...Sizes, ...body }), id);
    return NextResponse.json({ message: "Size added!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
