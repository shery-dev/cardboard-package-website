import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const box_name = params.name;
    if (!box_name) return NextResponse.json({ message: "box_name is required" }, { status: 400 });
    const db = getDb();
    const rows = db.prepare("SELECT * FROM feature_products WHERE box_name = ?").all(box_name);
    const data = rows.map((r) => ({
      _id: String(r.id),
      box_name: r.box_name,
      materail: r.materail,
      colour: typeof r.colour === "string" ? JSON.parse(r.colour || "{}") : r.colour,
      images: typeof r.images === "string" ? JSON.parse(r.images || "{}") : r.images,
      imageRotation: typeof r.imageRotation === "string" ? JSON.parse(r.imageRotation || "{}") : r.imageRotation,
      imagesizes: typeof r.imagesizes === "string" ? JSON.parse(r.imagesizes || "{}") : r.imagesizes,
      imagePosition: typeof r.imagePosition === "string" ? JSON.parse(r.imagePosition || "{}") : r.imagePosition,
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const box_name = params.name;
    const body = await request.json();
    const { colour, images, imageRotation, imagesizes, imagePosition, materail } = body;
    if (!box_name) return NextResponse.json({ message: "box_name is required" }, { status: 400 });
    const db = getDb();
    const materailVal = materail || "MailerBoxOuterTex-Kraft.png";
    const result = db.prepare(
      "INSERT INTO feature_products (box_name, materail, colour, images, imageRotation, imagesizes, imagePosition) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(
      box_name,
      materailVal,
      JSON.stringify(colour || {}),
      JSON.stringify(images || {}),
      JSON.stringify(imageRotation || {}),
      JSON.stringify(imagesizes || {}),
      JSON.stringify(imagePosition || {})
    );
    const id = result.lastInsertRowid;
    const link = `/customTool?type=main&designId=${id}`;
    return NextResponse.json({ message: "Saved", id, link }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
  }
}
