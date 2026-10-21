import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dir = path.join(process.cwd(), "data");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const dbPath = path.join(dir, "cardboard.db");

let db = null;

function getDb() {
  if (db) return db;
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  initSchema(db);
  return db;
}

function initSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER REFERENCES categories(id),
      cardboardname TEXT NOT NULL,
      description TEXT NOT NULL,
      heading TEXT,
      img TEXT NOT NULL DEFAULT '[]'
    );
  `);
  // Add parent_id if migrating from older schema
  try {
    database.exec(`ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id)`);
  } catch (_) {}
  try {
    database.exec(`ALTER TABLE categories ADD COLUMN description_long TEXT`);
  } catch (_) {}
  try {
    database.exec(`ALTER TABLE categories ADD COLUMN features TEXT NOT NULL DEFAULT '[]'`);
  } catch (_) {}
  try {
    database.exec(`ALTER TABLE products ADD COLUMN sku TEXT`);
  } catch (_) {}
  try {
    database.exec(`ALTER TABLE products ADD COLUMN price_tiers TEXT`);
  } catch (_) {}
  try {
    database.exec(`ALTER TABLE products ADD COLUMN description_long TEXT`);
  } catch (_) {}
  try {
    database.exec(`ALTER TABLE products ADD COLUMN features TEXT DEFAULT '[]'`);
  } catch (_) {}
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mainType INTEGER NOT NULL REFERENCES categories(id),
      cardboardname TEXT NOT NULL,
      description TEXT,
      rate REAL NOT NULL,
      quantity INTEGER DEFAULT 0,
      minOrder INTEGER NOT NULL,
      dimensions TEXT NOT NULL DEFAULT '{}',
      images TEXT NOT NULL DEFAULT '[]',
      sku TEXT,
      price_tiers TEXT,
      description_long TEXT,
      features TEXT DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS product_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL REFERENCES products(id),
      authorName TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      orderStatus TEXT NOT NULL,
      shippingStatus TEXT NOT NULL,
      orders TEXT NOT NULL DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS stock_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productType TEXT NOT NULL,
      productId INTEGER,
      operation TEXT NOT NULL,
      categoryType TEXT,
      productSize REAL,
      reelWeight REAL,
      reelVendor TEXT,
      time TEXT,
      quantity INTEGER
    );
    CREATE TABLE IF NOT EXISTS costs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      labor REAL,
      printedSides REAL,
      rent REAL,
      imagePrintedSide REAL
    );
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materailName TEXT NOT NULL,
      paperRate REAL NOT NULL,
      rollRate REAL NOT NULL,
      gamrige REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS rolls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Type TEXT NOT NULL,
      Rate REAL NOT NULL,
      Sizes TEXT DEFAULT '{}',
      description TEXT NOT NULL,
      Quantity INTEGER NOT NULL,
      images TEXT DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS reels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Type TEXT NOT NULL,
      Sizes TEXT DEFAULT '[]',
      description TEXT NOT NULL,
      Quantity INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS feature_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      box_name TEXT NOT NULL,
      materail TEXT NOT NULL,
      colour TEXT DEFAULT '{}',
      images TEXT DEFAULT '{}',
      imageRotation TEXT DEFAULT '{}',
      imagesizes TEXT DEFAULT '{}',
      imagePosition TEXT DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS box_material_rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material_name TEXT NOT NULL UNIQUE,
      rate REAL NOT NULL DEFAULT 100
    );
    CREATE TABLE IF NOT EXISTS box_pricing_settings (
      key TEXT PRIMARY KEY,
      value REAL NOT NULL
    );
    INSERT OR IGNORE INTO box_material_rates (material_name, rate) VALUES ('Kraft', 100), ('White', 200), ('Dreamcoat', 300);
    INSERT OR IGNORE INTO box_pricing_settings (key, value) VALUES ('dollar_rate', 280);
    INSERT OR IGNORE INTO costs (id, labor, printedSides, rent, imagePrintedSide) VALUES (1, 0, 0, 0, 0);
  `);
  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL REFERENCES products(id),
        authorName TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        createdAt TEXT DEFAULT (datetime('now'))
      )
    `);
  } catch (_) {}
}

export { getDb };
