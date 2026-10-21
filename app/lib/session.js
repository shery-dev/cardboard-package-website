import "server-only";
import jwt from "jsonwebtoken";

export async function decrypt(token) {
  try {
    if (!process.env.JWT_SECRET) {
      console.warn("[auth] JWT_SECRET is not set in .env.local — session will not verify. See docs/LOCAL_LOGIN_SETUP.md");
      return null;
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
    return null;
  }
}
