import { Inter, Lora } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import AppContextProvider from "@/context/Context";

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
  title: "Cardboard Packaging & Custom Boxes | Pakistan & USA | Cardboard Package",
  description: "Custom cardboard packaging and custom boxes for Pakistan and the USA. Corrugated boxes, mailer boxes, food packaging, and cartons. Design online, get a quote, low minimums. Quality cardboard packaging that protects and impresses.",
  keywords: ["cardboard packaging", "custom boxes", "custom packaging", "corrugated boxes", "mailer boxes", "cardboard boxes Pakistan", "custom boxes USA", "packaging boxes", "carton boxes", "food packaging boxes"],
  openGraph: {
    title: "Cardboard Packaging & Custom Boxes | Pakistan & USA",
    description: "Custom cardboard packaging and custom boxes. Corrugated, mailer, and food packaging. Design online, get a quote. Pakistan & USA.",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/img/logo.svg" />

      </head>
      <body className={`${inter.variable} ${lora.variable}`}>
        <AppContextProvider>
          {/* Strip behind navbar (z below navbar) */}
          <div className="fixed top-0 left-0 right-0 h-14 z-[40] bg-heroSecBg" aria-hidden />
          <nav>
            <Navbar />
          </nav>
          {/* Spacer so content starts below fixed navbar; min-height so footer stays at bottom when content is short */}
          <div className="pt-14 min-h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex-1">{children}</div>
            <FooterSection />
          </div>
        </AppContextProvider>
      </body>
    </html>
  );
}
