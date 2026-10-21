import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const { username, email, orders, orderStatus, shippingStatus } = await request.json();
    const db = getDb();
    const stmt = db.prepare(
      "INSERT INTO orders (userId, username, email, orderStatus, shippingStatus, orders) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(
      email || null,
      username || "",
      email || "",
      orderStatus || "Unpaid",
      shippingStatus || "Processing",
      JSON.stringify(orders || [])
    );
    return NextResponse.json({ message: "Order created", status: 200 }, { status: 200 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}
