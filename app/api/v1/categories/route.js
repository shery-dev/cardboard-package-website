import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { getDb } from "@/lib/db";

async function getAuthUser() {
  const session = cookies().get("session");
  if (!session) return null;
  try {
    const token = JSON.parse(session.value).token;
    const payload = await decrypt(token);
    return payload;
  } catch {
    return null;
  }
}

/** GET: Read all categories from database (for admin). */
export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT id, parent_id, cardboardname, description, heading, img, description_long, features FROM categories ORDER BY parent_id, id"
      )
      .all();
    const data = rows.map((r) => ({
      _id: String(r.id),
      parent_id: r.parent_id != null ? String(r.parent_id) : null,
      cardboardname: r.cardboardname || "",
      description: r.description || "",
      heading: r.heading || "",
      description_long: r.description_long || "",
      img: typeof r.img === "string" ? JSON.parse(r.img || "[]") : (r.img || []),
      features:
        typeof r.features === "string"
          ? JSON.parse(r.features || "[]")
          : (r.features || []),
    }));
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error("Categories GET error:", e);
    return NextResponse.json(
      { message: "Failed to load categories" },
      { status: 500 }
    );
  }
}

/** PUT: Update categories (admin only). Writes to database. */
export async function PUT(req) {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = Array.isArray(body) ? body : body.data || body.categories || [];
    const db = getDb();
    const update = db.prepare(`
      UPDATE categories
      SET parent_id = ?, cardboardname = ?, description = ?, heading = ?,
          img = ?, description_long = ?, features = ?
      WHERE id = ?
    `);
    for (const cat of data) {
      const id = parseInt(cat._id ?? cat.id, 10);
      if (isNaN(id)) continue;
      const img =
        typeof cat.img === "string"
          ? JSON.stringify(cat.img ? [cat.img] : [])
          : JSON.stringify(Array.isArray(cat.img) ? cat.img : []);
      const features =
        typeof cat.features === "string"
          ? cat.features
          : JSON.stringify(Array.isArray(cat.features) ? cat.features : []);
      update.run(
        cat.parent_id != null && cat.parent_id !== "" ? parseInt(cat.parent_id, 10) : null,
        cat.cardboardname || "",
        cat.description || "",
        cat.heading || "",
        img,
        cat.description_long || "",
        features,
        id
      );
    }
    return NextResponse.json({ message: "Categories updated", data }, { status: 200 });
  } catch (e) {
    console.error("Categories PUT error:", e);
    return NextResponse.json(
      { message: "Failed to save categories" },
      { status: 500 }
    );
  }
}
