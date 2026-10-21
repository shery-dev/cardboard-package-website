import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });
    const db = getDb();
    const row = db.prepare("SELECT * FROM feature_products WHERE id = ?").get(Number(id));
    if (!row) return NextResponse.json({ message: "Design not found" }, { status: 404 });
    const data = {
      id: row.id,
      box_name: row.box_name,
      materail: row.materail,
      colour: typeof row.colour === "string" ? JSON.parse(row.colour || "{}") : row.colour,
      images: typeof row.images === "string" ? JSON.parse(row.images || "{}") : row.images,
      imageRotation: typeof row.imageRotation === "string" ? JSON.parse(row.imageRotation || "{}") : row.imageRotation,
      imagesizes: typeof row.imagesizes === "string" ? JSON.parse(row.imagesizes || "{}") : row.imagesizes,
      imagePosition: typeof row.imagePosition === "string" ? JSON.parse(row.imagePosition || "{}") : row.imagePosition,
    };
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });
    const db = getDb();
    const result = db.prepare("DELETE FROM feature_products WHERE id = ?").run(Number(id));
    if (result.changes === 0) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Design deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}
