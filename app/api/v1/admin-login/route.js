import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs";

function getCookieStore() {
  const c = cookies();
  return typeof c?.then === "function" ? c : Promise.resolve(c);
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const credPath = path.join(process.cwd(), "data", "admin-credentials.json");
    let adminEmail = process.env.ADMIN_EMAIL || "";
    let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";
    let adminPasswordPlain = process.env.ADMIN_PASSWORD || "";

    if (fs.existsSync(credPath)) {
      try {
        const raw = fs.readFileSync(credPath, "utf-8");
        const creds = JSON.parse(raw);
        if (creds.email) adminEmail = creds.email;
        if (creds.passwordHash) adminPasswordHash = creds.passwordHash;
      } catch (_) {}
    }

    if (!adminEmail || (!adminPasswordHash && !adminPasswordPlain)) {
      return NextResponse.json({ message: "Admin credentials not configured" }, { status: 500 });
    }

    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    let match = false;
    if (adminPasswordHash) {
      match = await bcrypt.compare(password, adminPasswordHash);
    } else if (adminPasswordPlain) {
      match = password === adminPasswordPlain;
    }

    if (!match) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }
    const payload = {
      id: "admin",
      email: adminEmail,
      name: "Admin",
      isAdmin: true,
      fromAdminLogin: true,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = { token, expiresAt };

    const cookieStore = await getCookieStore();
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(
      { message: "Sign in successful", email: creds.email, name: "Admin" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
