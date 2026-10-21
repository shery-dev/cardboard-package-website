import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Costs data not found" }, { status: 404 });
    const db = getDb();
    const r = db.prepare("SELECT id, labor, printedSides, rent, imagePrintedSide FROM costs WHERE id = ?").get(id);
    if (!r) return NextResponse.json({ message: "Costs data not found" }, { status: 404 });
    return NextResponse.json(
      { _id: String(r.id), labor: r.labor, printedSides: r.printedSides, rent: r.rent, imagePrintedSide: r.imagePrintedSide },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
