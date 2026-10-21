import { Inter, Lora } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/Dashboard/SideBar/SideBar";
import { CheckUser } from "@/components/CheckUser";
import { redirect } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-lora",
});

export const metadata = {
  title: "Admin Panel",
  description: "Cardboard package admin panel",
};

export default async function RootLayout({ children }) {
  const user = await CheckUser();
  if (!user || !user.fromAdminLogin) {
    redirect("/admin-login");
  }
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable}`}>
        <div className="h-screen grid grid-cols-12 grid-rows-1 gap-2">
          <div className=" fixed h-screen w-[20vw] col-span-3 row-span-1 shadow-md">
            <SideBar />
          </div>
          <div className="col-span-9 col-start-4">{children}</div>
        </div>
      </body>
    </html>
  );
}
