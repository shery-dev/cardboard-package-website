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
    const cardboardname = formData.get("name")?.toString()?.trim();
    const description = formData.get("description")?.toString() || "";
    const descriptionLong = formData.get("description_long")?.toString() || null;
    const rate = parseFloat(formData.get("rate")) || 0;
    const quantity = parseInt(formData.get("quantity"), 10) || 0;
    const dimensionsStr = formData.get("dimensions")?.toString();
    const dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : { length: "", width: 0, depth: "" };
    const existingImagesRaw = formData.get("existingImages")?.toString();
    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
    const sku = formData.get("sku")?.toString()?.trim() || null;
    const priceTiersRaw = formData.get("price_tiers")?.toString()?.trim();
    const featuresRaw = formData.get("features")?.toString()?.trim();

    let priceTiersJson = null;
    if (priceTiersRaw) {
      try {
        const parsed = JSON.parse(priceTiersRaw);
        priceTiersJson = Array.isArray(parsed) ? JSON.stringify(parsed) : null;
      } catch (_) {}
    }
    const featuresJson = featuresRaw
      ? JSON.stringify(featuresRaw.split("\n").map((s) => s.trim()).filter(Boolean))
      : "[]";

    const db = getDb();
    let finalImagePaths = [...existingImages];
    const imageFiles = formData.getAll("images");
    if (imageFiles && imageFiles.length > 0) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      for (const img of imageFiles) {
        if (img && typeof img !== "string" && img instanceof Blob && img.size > 0) {
          const ext = path.extname(img.name || "") || ".png";
          const filename = `${Date.now()}_${finalImagePaths.length}${ext}`;
          const filePath = path.join(UPLOAD_DIR, filename);
          const buffer = Buffer.from(await img.arrayBuffer());
          await fs.writeFile(filePath, buffer);
          finalImagePaths.push(filename);
        }
      }
    }
    const imagesJson = JSON.stringify(finalImagePaths);

    db.prepare(
      "UPDATE products SET cardboardname = ?, description = ?, description_long = ?, rate = ?, quantity = ?, dimensions = ?, images = ?, sku = ?, price_tiers = ?, features = ? WHERE id = ?"
    ).run(cardboardname, description, descriptionLong, rate, quantity, JSON.stringify(dimensions), imagesJson, sku, priceTiersJson, featuresJson, id);

    return NextResponse.json({ message: "Updated Successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
