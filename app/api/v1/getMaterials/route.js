import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT id, materailName, paperRate, rollRate, gamrige FROM materials").all();
    const data = rows.map((r) => ({
      _id: String(r.id),
      materailName: r.materailName,
      paperRate: r.paperRate,
      rollRate: r.rollRate,
      gamrige: r.gamrige,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
