import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    if (!userId) return NextResponse.json({ data: [] }, { status: 200 });
    const db = getDb();
    const rows = db
      .prepare("SELECT id, userId, username, email, orderStatus, shippingStatus, orders, created_at FROM orders WHERE userId = ? ORDER BY id DESC")
      .all(userId);
    const data = rows.map((r) => ({
      _id: String(r.id),
      userId: r.userId,
      username: r.username,
      email: r.email,
      orderStatus: r.orderStatus,
      shippingStatus: r.shippingStatus,
      orders: typeof r.orders === "string" ? JSON.parse(r.orders || "[]") : r.orders,
      created_at: r.created_at,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}
