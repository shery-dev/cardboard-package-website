import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const { size, vendorId, Rate } = await request.json();
    if (!params.id) return NextResponse.json({ message: "Missing required fields!" }, { status: 400 });
    return NextResponse.json({ message: "Updated Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
