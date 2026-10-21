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
    const minOrder = parseInt(formData.get("order"), 10) || 0;
    const mainType = parseInt(formData.get("mainType"), 10);
    const description = formData.get("description")?.toString() || "";
    const descriptionLong = formData.get("description_long")?.toString() || null;
    const dimensionsStr = formData.get("dimensions")?.toString();
    const cardboardname = formData.get("name")?.toString()?.trim();
    const rate = parseFloat(formData.get("rate")) || 0;
    const quantity = parseInt(formData.get("quantity") || formData.get("stock"), 10) || 0;
    const sku = formData.get("sku")?.toString()?.trim() || null;
    const priceTiersRaw = formData.get("price_tiers")?.toString()?.trim();
    const featuresRaw = formData.get("features")?.toString()?.trim();

    if (!cardboardname || isNaN(mainType)) {
      return NextResponse.json({ message: "Name and category are required" }, { status: 400 });
    }

    let priceTiers = null;
    if (priceTiersRaw) {
      try {
        const parsed = JSON.parse(priceTiersRaw);
        priceTiers = Array.isArray(parsed) ? JSON.stringify(parsed) : null;
      } catch (_) {}
    }
    const features = featuresRaw
      ? JSON.stringify(featuresRaw.split("\n").map((s) => s.trim()).filter(Boolean))
      : "[]";

    const dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : { length: "", width: 0, depth: "" };
    const fileNames = [];
    const imageFiles = formData.getAll("image");
    if (imageFiles && imageFiles.length > 0) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      for (const img of imageFiles) {
        if (img && typeof img !== "string" && img instanceof Blob && img.size > 0) {
          const ext = path.extname(img.name || "") || ".png";
          const filename = `${Date.now()}_${fileNames.length}${ext}`;
          const filePath = path.join(UPLOAD_DIR, filename);
          const buffer = Buffer.from(await img.arrayBuffer());
          await fs.writeFile(filePath, buffer);
          fileNames.push(filename);
        }
      }
    }
    if (fileNames.length === 0) {
      return NextResponse.json({ message: "At least one image is required" }, { status: 400 });
    }

    const db = getDb();
    db.prepare(
      "INSERT INTO products (mainType, cardboardname, description, description_long, rate, quantity, minOrder, dimensions, images, sku, price_tiers, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      mainType,
      cardboardname,
      description,
      descriptionLong,
      rate,
      quantity,
      minOrder,
      JSON.stringify(dimensions),
      JSON.stringify(fileNames),
      sku,
      priceTiers,
      features
    );

    return NextResponse.json({ message: "Product added!" }, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
