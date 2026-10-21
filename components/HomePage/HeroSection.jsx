import Link from "next/link";
import Image from "next/image";
import { FaAward, FaBuilding, FaShippingFast } from "react-icons/fa";

const Header = () => {
  return (
    <div className="home-banner">
      <div className="outer-wrapper overflow-hidden bg-heroSecBg">
        <div className="inner-wrapper relative pb-0">
          <div className="mx-auto relative">
            <div className="lg:flex lg:items-center py-10 lg:py-14 px-8 sm:px-14">
              <div className="lg:w-1/2 lg:pr-14">
                <p className="text-mainBgColor font-semibold text-sm uppercase tracking-wider mb-3">
                  Cardboard packaging &amp; custom boxes for Pakistan and the USA
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-lora text-headingTxtColor mb-5 leading-tight">
                  Custom cardboard packaging that protects, impresses &amp; delivers
                </h1>
                <p className="text-base lg:text-lg text-gray-700 mb-8 max-w-xl leading-relaxed">
                  Your one-stop for cardboard packaging and custom boxes—corrugated boxes, mailer boxes, food packaging, and cartons. We serve businesses in Pakistan and the USA with durable, custom packaging tailored to your product. Design your box online or get a quote in minutes.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    href={{ pathname: "/customTool", query: { type: "main" } }}
                    className="inline-flex items-center gap-2 bg-mainBgColor hover:bg-mainBgHover text-white font-semibold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    CUSTOMIZE NOW
                    <span className="text-lg" aria-hidden>→</span>
                  </Link>
                  <Link
                    href="/quotes"
                    className="inline-flex items-center gap-2 bg-white hover:bg-heroSecBg/50 text-mainBgColor font-semibold py-3.5 px-8 rounded-full border-2 border-mainBgColor shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    GET A QUOTE
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-white/80 min-w-[140px]">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-headingTxtColor/10 text-headingTxtColor shrink-0">
                      <FaAward className="text-lg" />
                    </span>
                    <div>
                      <span className="font-semibold text-headingTxtColor block text-sm">PSEB</span>
                      <span className="text-gray-700 text-sm">Certified</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-white/80 min-w-[140px]">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-headingTxtColor/10 text-headingTxtColor shrink-0">
                      <FaBuilding className="text-lg" />
                    </span>
                    <div>
                      <span className="font-semibold text-headingTxtColor block text-sm">Registered</span>
                      <span className="text-gray-700 text-sm">Suppliers</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-white/80 min-w-[140px]">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-headingTxtColor/10 text-headingTxtColor shrink-0">
                      <FaShippingFast className="text-lg" />
                    </span>
                    <div>
                      <span className="text-gray-700 text-sm">Delivered in</span>
                      <span className="font-semibold text-headingTxtColor block text-sm">5 Days</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    className="w-full max-w-lg lg:max-w-none object-contain drop-shadow-2xl"
                    src="/img/Front-Page-removebg-preview.png"
                    alt="Custom cardboard packaging and custom boxes - mailer boxes, corrugated boxes, packaging design"
                    width={600}
                    height={500}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
