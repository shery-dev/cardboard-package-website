/**
 * One-time script to create an admin user so you can sign in and access the admin panel.
 * Run from project root: node scripts/seed-admin.js
 * Uses MONGO_URI from .env.local (or set MONGO_URI in the environment).
 *
 * Creates user: qasim@gmail.com / admin123 (admin)
 * Password is hashed with bcrypt by the User model.
 */

const path = require("path");
const fs = require("fs");

// Load .env.local if present
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  });
}

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true, minlength: 8 },
  isAdmin: { type: Boolean, default: false },
});

const Users = mongoose.models?.User || mongoose.model("User", UserSchema);

const EMAIL = "qasim@gmail.com";
const PASSWORD = "admin123";
const NAME = "Admin";

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to .env.local or set the env var.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash(PASSWORD, 10);
  const existing = await Users.findOne({ Email: EMAIL });
  if (existing) {
    await Users.updateOne({ Email: EMAIL }, { Password: hash, isAdmin: true, Name: NAME });
    console.log("Updated existing user:", EMAIL, "-> admin, password reset to admin123");
  } else {
    await Users.create({ Name: NAME, Email: EMAIL, Password: hash, isAdmin: true });
    console.log("Created admin user:", EMAIL, "/ admin123");
  }
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
