import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const { labour, rent, psCost, ipsCost } = await request.json();
    const db = getDb();
    const exists = db.prepare("SELECT 1 FROM costs WHERE id = ?").get(id);
    if (exists) {
      db.prepare(
        "UPDATE costs SET labor = ?, rent = ?, printedSides = ?, imagePrintedSide = ? WHERE id = ?"
      ).run(labour ?? null, rent ?? null, psCost ?? null, ipsCost ?? null, id);
    } else {
      db.prepare("INSERT INTO costs (id, labor, rent, printedSides, imagePrintedSide) VALUES (?, ?, ?, ?, ?)").run(
        id,
        labour ?? null,
        rent ?? null,
        psCost ?? null,
        ipsCost ?? null
      );
    }
    return NextResponse.json({ message: "Updated Successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
