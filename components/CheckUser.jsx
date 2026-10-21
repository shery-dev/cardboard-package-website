import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

function getCookieStore() {
  const c = cookies();
  return typeof c?.then === "function" ? c : Promise.resolve(c);
}

export async function CheckUser() {
  const cookieStore = await getCookieStore();
  const session = cookieStore.get("session");
  let user = null;
  if (session?.value) {
    try {
      const parsed = JSON.parse(session.value);
      const token = parsed?.token;
      if (token) {
        const payload = await decrypt(token);
        user = payload;
      }
    } catch (error) {
      console.error("Unauthorized User", error);
    }
  }
  return user;
}
