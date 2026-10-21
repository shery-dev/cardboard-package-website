import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(
      "SELECT id, box_name, materail FROM feature_products ORDER BY id DESC"
    ).all();
    const data = rows.map((r) => ({
      id: r.id,
      box_name: r.box_name,
      materail: r.materail,
      link: `/customTool?type=main&designId=${r.id}`,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}
