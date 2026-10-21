import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ message: "No images uploaded." }, { status: 400 });
    }

    const formData = await request.formData();
    const cardboardname = formData.get("typeName")?.toString()?.trim();
    const description = formData.get("description")?.toString()?.trim();
    const image = formData.get("image");
    const parentIdRaw = formData.get("parentId")?.toString();
    const parentId = parentIdRaw && parentIdRaw !== "" ? parseInt(parentIdRaw, 10) : null;

    if (!cardboardname || !description) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    if (!image || typeof image === "string" || typeof (image && image.arrayBuffer) !== "function") {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(image.name || "") || ".png";
    const filename = `${Date.now()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const db = getDb();
    const imgJson = JSON.stringify([filename]);
    const heading = formData.get("heading")?.toString()?.trim() || "";
    const descriptionLong = formData.get("description_long")?.toString()?.trim() || "";
    const stmt = db.prepare(
      "INSERT INTO categories (parent_id, cardboardname, description, heading, img, description_long, features) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    stmt.run(parentId, cardboardname, description, heading, imgJson, descriptionLong, "[]");

    return NextResponse.json({ message: "Added Successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
