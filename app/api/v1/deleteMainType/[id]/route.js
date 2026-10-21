import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const db = getDb();
    db.prepare("DELETE FROM products WHERE mainType = ?").run(id);
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);

    return NextResponse.json({ message: "Deleted Successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
