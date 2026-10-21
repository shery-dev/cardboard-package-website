import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM stock_tracking ORDER BY id DESC").all();
    const data = rows.map((r) => ({
      _id: r.id,
      productType: r.productType,
      productId: r.productId,
      operation: r.operation,
      categoryType: r.categoryType,
      productSize: r.productSize,
      reelWeight: r.reelWeight,
      reelVendor: r.reelVendor,
      time: r.time,
      quantity: r.quantity,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stock history:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
