import Image from "next/image";
import Link from "next/link";
import logo from "@/public/img/logo.svg";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative w-full bg-heroSecBg"
      style={{
        background: "linear-gradient(180deg, #FAB95B 0%, #FAB95B 6%, #E8E2DB 22%, #E8E2DB 100%)",
      }}
    >
      <div className="w-full mx-auto px-8 sm:px-14 py-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr] items-center gap-4">
        <Link href="/" className="flex items-center gap-2 justify-start shrink-0 order-1 sm:order-1" aria-label="Cardboard Package home">
          <Image
            src={logo}
            alt=""
            width={72}
            height={72}
            className="h-10 w-10 md:h-12 md:w-12 shrink-0"
          />
          <span className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-base font-lora font-bold text-headingTxtColor">Cardboard</span>
            <span className="text-base font-lora font-medium text-gray-400">Package</span>
          </span>
        </Link>
        <p className="text-sm text-gray-600 text-center order-2 sm:order-2 px-2">
          © {currentYear} Powered by{" "}
          <a
            href="https://reallytics.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-headingTxtColor hover:text-headingHover underline underline-offset-2"
          >
            Reallytics.ai
          </a>
          . All rights reserved.
        </p>
        <div className="hidden sm:block order-3" aria-hidden />
      </div>
    </footer>
  );
};

export default FooterSection;
