import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ message: "Invalid content type." }, { status: 400 });
    }

    const formData = await request.formData();
    const cardboardname = formData.get("typeName")?.toString()?.trim();
    const description = formData.get("description")?.toString()?.trim();
    const heading = formData.get("heading")?.toString()?.trim() || null;
    const descriptionLong = formData.get("description_long")?.toString()?.trim() || null;
    const featuresRaw = formData.get("features")?.toString()?.trim();
    const features = featuresRaw
      ? JSON.stringify(featuresRaw.split("\n").map((s) => s.trim()).filter(Boolean))
      : "[]";
    const image = formData.get("image");

    const db = getDb();
    if (image && typeof image !== "string" && image instanceof Blob && image.size > 0) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(image.name || "") || ".png";
      const filename = `${Date.now()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      const imgJson = JSON.stringify([filename]);
      db.prepare(
        "UPDATE categories SET cardboardname = ?, description = ?, heading = ?, description_long = ?, features = ?, img = ? WHERE id = ?"
      ).run(cardboardname || "", description || "", heading, descriptionLong, features, imgJson, id);
    } else {
      db.prepare(
        "UPDATE categories SET cardboardname = ?, description = ?, heading = ?, description_long = ?, features = ? WHERE id = ?"
      ).run(cardboardname || "", description || "", heading, descriptionLong, features, id);
    }

    return NextResponse.json({ message: "Updated Successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
