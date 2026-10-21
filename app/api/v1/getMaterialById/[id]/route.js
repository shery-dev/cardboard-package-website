import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Material not found" }, { status: 404 });
    const db = getDb();
    const r = db.prepare("SELECT id, materailName, paperRate, rollRate, gamrige FROM materials WHERE id = ?").get(id);
    if (!r) return NextResponse.json({ message: "Material not found" }, { status: 404 });
    return NextResponse.json(
      { _id: String(r.id), materailName: r.materailName, paperRate: r.paperRate, rollRate: r.rollRate, gamrige: r.gamrige },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
