import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid category id" }, { status: 400 });
    }

    const db = getDb();
    const row = db
      .prepare(
        "SELECT id, parent_id, cardboardname, description, heading, img, description_long, features FROM categories WHERE id = ?"
      )
      .get(id);

    if (!row) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const data = {
      _id: String(row.id),
      parent_id: row.parent_id != null ? row.parent_id : null,
      cardboardname: row.cardboardname,
      description: row.description || "",
      heading: row.heading || "",
      description_long: row.description_long || "",
      features:
        typeof row.features === "string"
          ? JSON.parse(row.features || "[]")
          : row.features || [],
      img: JSON.parse(row.img || "[]").map((f) =>
        f.startsWith("/") ? f : `/uploads/${f}`
      ),
    };

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
