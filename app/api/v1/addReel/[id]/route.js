import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    const formData = await request.formData();
    const productType = "reel";
    const operation = "stock-in";
    const categoryType = formData.get("typeName")?.toString() || "";
    const productSize = parseFloat(formData.get("size")) || null;
    const reelWeight = formData.get("weight")?.toString() || null;
    const reelVendor = formData.get("vendorName")?.toString() || null;
    const db = getDb();
    db.prepare(
      "INSERT INTO stock_tracking (productType, operation, categoryType, productSize, reelWeight, reelVendor) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(productType, operation, categoryType, productSize, reelWeight, reelVendor);
    return NextResponse.json({ message: "Vendor added successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
