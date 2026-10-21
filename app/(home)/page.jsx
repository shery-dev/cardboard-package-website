import HeroSection from "@/components/HomePage/HeroSection";
import PackingBoxesBanner from "@/components/HomePage/PackingBoxesBanner";
import BrandsSlider from "@/components/HomePage/BrandsSlider";
import ProductsShowcaseSection from "@/components/HomePage/ProductsShowcaseSection";
import SolutionsSection from "@/components/HomePage/SolutionsSection";
import BoxInspirationsCards from "@/components/HomePage/BoxInspirationsCards";
import FAQSection from "@/components/HomePage/FAQSection";
import PaymentIntro from "@/components/PaymentIntro";

export default function Home() {
  return (
    <>
      <div>
        <HeroSection />
      </div>
      <PackingBoxesBanner />
      <div id="products" className="w-full scroll-mt-20">
        <section className="w-full bg-secDifferBg pt-12 pb-6 px-6 sm:px-10 lg:px-14">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-headingTxtColor font-lora font-bold mb-4">
              Check out our Products
            </h2>
            <p className="text-center sm:text-lg lg:text-xl text-gray-800 font-inter font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            We provide <strong>ration packaging</strong>, <strong>food & restaurant packaging</strong>, <strong>corrugated boxes</strong>, and <strong>shipping cartons</strong> designed for bulk storage, takeaway, e-commerce, and brand packaging needs.
            </p>
          </div>
        </section>
        <ProductsShowcaseSection />
      </div>
      <section
        className="relative z-10 w-full overflow-hidden flex items-center justify-center min-h-[56px] py-4 bg-heroSecBg -mb-6"
        style={{ background: "#E8E2DB" }}
      >
        <div className="w-full flex items-center justify-center">
          <BrandsSlider />
        </div>
      </section>
      <div className="relative -mt-6 pt-6">
        <SolutionsSection />
      </div>
      <section className="mt-16 mb-10 py-12 sm:py-16 px-6 sm:px-10 lg:px-14 bg-secDifferBg rounded-2xl max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-4xl mx-auto py-6 sm:py-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-headingTxtColor font-lora font-bold text-center">
            Box Inspirations
          </h2>
          <p className="text-center sm:text-lg lg:text-xl text-gray-800 font-inter font-medium max-w-2xl leading-relaxed">
            See what&apos;s possible with custom packaging. From retail and e-commerce to food, electronics, and shipping—we deliver quality boxes that keep your products safe and your brand memorable. Simple process, strong results.
          </p>
        </div>
        <div className="w-full flex justify-center py-6 sm:py-8">
          <BoxInspirationsCards />
        </div>
      </section>
      <FAQSection />
      <PaymentIntro />
    </>
  );
}
