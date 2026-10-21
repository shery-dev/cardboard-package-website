import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const db = getDb();
    db.prepare("UPDATE rolls SET Quantity = Quantity + ? WHERE id = ?").run(1, id);
    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
