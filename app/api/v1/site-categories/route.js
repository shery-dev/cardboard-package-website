import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT id, parent_id, cardboardname, description, heading, img, description_long, features FROM categories ORDER BY parent_id, id").all();
    const data = rows.map((r) => ({
      _id: String(r.id),
      parent_id: r.parent_id != null ? r.parent_id : null,
      cardboardname: r.cardboardname,
      description: r.description || "",
      heading: r.heading || "",
      description_long: r.description_long || "",
      features: typeof r.features === "string" ? JSON.parse(r.features || "[]") : (r.features || []),
      img: JSON.parse(r.img || "[]").map((f) => (f.startsWith("/") ? f : `/uploads/${f}`)),
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching site categories:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
