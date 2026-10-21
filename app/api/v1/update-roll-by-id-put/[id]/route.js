import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const body = await request.json();
    const db = getDb();
    const fields = [];
    const values = [];
    if (body.Type != null) { fields.push("Type = ?"); values.push(body.Type); }
    if (body.Rate != null) { fields.push("Rate = ?"); values.push(body.Rate); }
    if (body.description != null) { fields.push("description = ?"); values.push(body.description); }
    if (body.Quantity != null) { fields.push("Quantity = ?"); values.push(body.Quantity); }
    if (body.Sizes != null) { fields.push("Sizes = ?"); values.push(JSON.stringify(body.Sizes)); }
    if (body.images != null) { fields.push("images = ?"); values.push(JSON.stringify(body.images)); }
    if (fields.length) {
      values.push(id);
      db.prepare(`UPDATE rolls SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    }
    return NextResponse.json({ message: "Updated Successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
