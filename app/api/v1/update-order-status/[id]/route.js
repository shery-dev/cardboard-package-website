import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }
    const body = await request.json();
    const orderStatus = body.orderStatus;
    const shippingStatus = body.shippingStatus;

    const db = getDb();
    if (orderStatus !== undefined) {
      db.prepare("UPDATE orders SET orderStatus = ? WHERE id = ?").run(orderStatus, id);
    }
    if (shippingStatus !== undefined) {
      db.prepare("UPDATE orders SET shippingStatus = ? WHERE id = ?").run(shippingStatus, id);
    }
    return NextResponse.json({ message: "Order updated successfully!", status: 200 }, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}
