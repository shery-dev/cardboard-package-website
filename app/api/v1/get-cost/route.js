import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT id, labor, printedSides, rent, imagePrintedSide FROM costs").all();
    const data = rows.map((r) => ({
      _id: String(r.id),
      labor: r.labor,
      printedSides: r.printedSides,
      rent: r.rent,
      imagePrintedSide: r.imagePrintedSide,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
