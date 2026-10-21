/**
 * Update an existing user's password in MongoDB (hashes with bcrypt).
 *
 * Usage (from project root):
 *   node scripts/update-admin-password.js
 *   # Uses EMAIL and NEW_PASSWORD from .env.local or environment.
 *
 * Or with inline env vars:
 *   EMAIL=admin@gmail.com NEW_PASSWORD=admin123 node scripts/update-admin-password.js
 *
 * If EMAIL or NEW_PASSWORD are not set, the script will prompt for them.
 */

const path = require("path");
const fs = require("fs");
const readline = require("readline");

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

function ask(rl, prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function main() {
  let email = process.env.EMAIL;
  let newPassword = process.env.NEW_PASSWORD;

  if (!email || !newPassword) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    if (!email) email = (await ask(rl, "User email (e.g. admin@gmail.com): ")).trim();
    if (!newPassword) newPassword = (await ask(rl, "New password: ")).trim();
    rl.close();
  }

  if (!email || !newPassword) {
    console.error("Email and new password are required.");
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to .env.local or set the env var.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await Users.findOne({ Email: email });
  if (!user) {
    console.error("User not found with email:", email);
    await mongoose.disconnect();
    process.exit(1);
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await Users.updateOne({ Email: email }, { Password: hash });
  console.log("Password updated for:", email);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
