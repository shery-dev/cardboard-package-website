import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const { materialName, paperRate, rollRate, gamrige } = await request.json();
    const db = getDb();
    const name = materialName ?? null;
    db.prepare("UPDATE materials SET materailName = ?, paperRate = ?, rollRate = ?, gamrige = ? WHERE id = ?").run(
      name,
      paperRate ?? null,
      rollRate ?? null,
      gamrige ?? null,
      id
    );
    return NextResponse.json({ message: "Updated Successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
