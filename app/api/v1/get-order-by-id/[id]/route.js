import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ data: null }, { status: 404 });
    }
    const db = getDb();
    const r = db
      .prepare(
        "SELECT id, userId, username, email, orderStatus, shippingStatus, orders, created_at FROM orders WHERE id = ?"
      )
      .get(id);
    if (!r) {
      return NextResponse.json({ data: null }, { status: 404 });
    }
    const data = {
      _id: String(r.id),
      userId: r.userId,
      username: r.username,
      email: r.email,
      orderStatus: r.orderStatus,
      shippingStatus: r.shippingStatus,
      orders: typeof r.orders === "string" ? JSON.parse(r.orders || "[]") : r.orders,
      created_at: r.created_at,
    };
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}
