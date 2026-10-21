# Local SQLite storage (no MongoDB)

**All app data is stored locally.** MongoDB is not used anywhere.

- **Database:** `data/cardboard.db` (SQLite), created automatically on first use.
- **Uploads:** Images in `public/uploads/`.
- **Admin login:** `data/admin-credentials.json` (file-based).

## Tables

- **categories** – Product types (cardboardname, description, img paths).
- **products** – Products (mainType = category id, cardboardname, rate, quantity, dimensions, images).
- **orders** – Orders (username, email, orderStatus, shippingStatus, line items as JSON).
- **stock_tracking** – Stock history (product/reel/roll operations).
- **costs** – Cost attributes (labor, rent, printedSides, imagePrintedSide).
- **materials** – Materials (materailName, paperRate, rollRate, gamrige).
- **rolls** – Rolls (Type, Rate, Sizes, description, Quantity, images).
- **reels** – Reels (Type, Sizes, description, Quantity).
- **feature_products** – Feature product config (box_name, materail, colour, images, etc.).

## Removed

- Customer Sign-In/Register (MongoDB Users) – removed; `/user-auth` and `/register` redirect to `/admin-login`.
- All API routes that used MongoDB have been replaced with SQLite-backed routes. `utils/dbconn.js` has been removed.

## Backup

To backup or move your data, copy `data/cardboard.db`. To start fresh, delete that file; it will be recreated empty on next run.
