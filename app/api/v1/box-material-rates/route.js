import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const DEFAULT_RATES = { Kraft: 100, White: 200, Dreamcoat: 300 };
const DEFAULT_DOLLAR_RATE = 280;

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT material_name, rate FROM box_material_rates").all();
    const data = rows.length
      ? Object.fromEntries(rows.map((r) => [r.material_name, Number(r.rate)]))
      : DEFAULT_RATES;
    let dollarRate = DEFAULT_DOLLAR_RATE;
    try {
      const row = db.prepare("SELECT value FROM box_pricing_settings WHERE key = 'dollar_rate'").get();
      if (row != null) dollarRate = Number(row.value) || DEFAULT_DOLLAR_RATE;
    } catch (_) {}
    return NextResponse.json({ data, dollarRate }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: DEFAULT_RATES, dollarRate: DEFAULT_DOLLAR_RATE }, { status: 200 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Body must be an object" }, { status: 400 });
    }
    const db = getDb();
    const updateStmt = db.prepare("UPDATE box_material_rates SET rate = ? WHERE material_name = ?");
    const insertStmt = db.prepare("INSERT OR REPLACE INTO box_material_rates (material_name, rate) VALUES (?, ?)");
    for (const [name, rate] of Object.entries(body)) {
      if (name === "dollarRate") continue;
      if (typeof name !== "string") continue;
      const r = Number(rate);
      if (Number.isNaN(r) || r < 0) continue;
      const key = name.trim();
      if (!key) continue;
      insertStmt.run(key, r);
    }
    const dollarRate = Number(body.dollarRate);
    if (!Number.isNaN(dollarRate) && dollarRate > 0) {
      db.prepare("INSERT OR REPLACE INTO box_pricing_settings (key, value) VALUES ('dollar_rate', ?)").run(dollarRate);
    }
    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (error) {
    console.error("[box-material-rates] PUT error:", error?.message || error);
    return NextResponse.json(
      { message: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
