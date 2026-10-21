import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT id, parent_id, cardboardname, description, heading, img FROM categories ORDER BY parent_id, id").all();
    const data = rows.map((r) => ({
      _id: String(r.id),
      parent_id: r.parent_id != null ? String(r.parent_id) : null,
      cardboardname: r.cardboardname,
      description: r.description,
      heading: r.heading || "",
      img: JSON.parse(r.img || "[]"),
    }));
    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
