import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const Type = body.Type ?? "";
    const Rate = body.Rate ?? 0;
    const description = body.description ?? "";
    const Quantity = body.Quantity ?? 0;
    const Sizes = JSON.stringify(body.Sizes ?? {});
    const images = JSON.stringify(body.images ?? []);
    const db = getDb();
    db.prepare(
      "INSERT INTO rolls (Type, Rate, Sizes, description, Quantity, images) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(Type, Rate, Sizes, description, Quantity, images);
    return NextResponse.json({ message: "Added successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
