"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/Context";
import { FaStar } from "react-icons/fa";
import SingleProductCard from "@/components/SingleProductCard";

const PLY_LABELS = ["2 ply", "5 ply", "7 ply"];

const ProductPageAmazon = ({ product, similarProducts = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const tiers = product?.price_tiers || [];
  const displayTiers = tiers.slice(0, 3);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { setItemsList } = useAppContext();

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const imgSrc = (src) => (src?.startsWith("/") ? src : `/api/v1/fetchImg/${src}`);
  const currentTier = displayTiers[selectedTierIndex] || tiers[0];
  const totalPrice = currentTier ? currentTier.price * quantity : product.rate * quantity;
  const priceRange =
    tiers.length > 0
      ? `Rs ${Math.min(...tiers.map((t) => t.price))} – Rs ${Math.max(...tiers.map((t) => t.price))}`
      : `Rs ${product.rate}`;

  const reviewCount = product.reviews?.length || 0;
  const plyLabel = PLY_LABELS[selectedTierIndex] ?? `${selectedTierIndex + 2} ply`;
  const plyValue = [2, 5, 7][selectedTierIndex] ?? 5;
  const isKraftPaper = product.categoryName === "Kraft Paper Products";

  const handleAddToCart = () => {
    const price = currentTier ? currentTier.price * quantity : product.rate * quantity;
    const item = {
      id: product._id,
      ThreeD: false,
      name: product.cardboardname,
      img: images[0],
      quantity,
      pricePerPiece: currentTier ? currentTier.price : product.rate,
      price,
      pieceLabel: plyLabel,
      dimension: product.dimensions,
      printedSides: 4,
      material: "Kraft",
      thickness: plyValue,
    };
    setItemsList((prev) => [...prev, item]);
    window.scrollTo(0, 0);
  };

  // Skip feature bullets that only repeat size (dimensions are in heading)
  const features = (product.features || []).filter(
    (f) => typeof f === "string" && !f.trim().toLowerCase().startsWith("size:")
  );

  return (
    <div className="min-h-screen bg-white pt-8">
      <div className="container mx-auto px-6 py-6 lg:px-14 max-w-6xl">
        {/* Breadcrumb: Home -> category name -> product */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-headingTxtColor">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/cardboard/products-list/${product.mainType}`}
            className="hover:text-headingTxtColor"
          >
            {product.categoryName || "Ration Packaging Boxes"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.cardboardname}</span>
        </nav>

        {/* Two columns: left = images (main + thumbnails below), right = content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-stretch">
          {/* Left: main image fills space, then 2 thumbnails at bottom */}
          {images.length > 0 && (
            <div className="w-full lg:w-2/5 shrink-0 flex flex-col gap-4">
              <div className="relative w-full min-h-[400px] flex-1 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                {images[selectedImage] && (
                  <Image
                    src={imgSrc(images[selectedImage])}
                    alt={product.cardboardname}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className={`object-contain ${isKraftPaper ? "scale-110" : ""}`}
                    priority
                  />
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`w-24 h-24 rounded border-2 overflow-hidden shrink-0 ${
                      selectedImage === i ? "border-mainBgColor" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={imgSrc(img)}
                      alt={`View ${i + 1}`}
                      width={96}
                      height={96}
                      className={`w-full h-full object-contain ${isKraftPaper ? "scale-110" : ""}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Right: all product content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-lora mb-3">
              {product.cardboardname}
            </h1>

            {reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  ({reviewCount} customer review{reviewCount !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <p className="text-2xl font-bold text-gray-900 mb-6">{priceRange}</p>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {tiers.length > 0 && (
              <>
                <p className="font-semibold text-gray-900 mb-2">Thickness (ply)</p>
                <div className="flex gap-2 mb-6">
                  {displayTiers.map((t, i) => (
                    <button
                      key={t.pcs}
                      type="button"
                      onClick={() => setSelectedTierIndex(i)}
                      className={`px-4 py-2 rounded border-2 text-sm font-medium ${
                        selectedTierIndex === i
                          ? "border-mainBgColor bg-mainBgColor text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {PLY_LABELS[i] ?? `${[2, 5, 7][i] ?? i + 2} ply`}
                    </button>
                  ))}
                </div>

                <ul className="list-disc list-outside pl-5 text-gray-700 space-y-1 mb-6">
                  {features.map((f, i) => (
                    <li key={i} className="pl-1">{f.replace(/\bheavy\b/gi, "sturdy")}</li>
                  ))}
                </ul>

                <p className="text-sm text-gray-500 mb-6">
                  (Additional delivery charges will be applied for more than 5 pieces, which will be
                  communicated after order confirmation)
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-mainBgColor text-white font-semibold rounded hover:bg-mainBgHover"
                  >
                    Add to cart
                  </button>
                </div>

                <p className="text-lg font-semibold text-gray-900 mb-6">
                  Rs {currentTier?.price || product.rate} × {quantity} = Rs {totalPrice}
                </p>
              </>
            )}

            {product.sku && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">SKU:</span> {product.sku}
              </p>
            )}
            {product.categoryName && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Categories:</span>{" "}
                <Link
                  href={`/cardboard/products-list/${product.mainType}`}
                  className="text-mainBgColor hover:underline"
                >
                  {product.categoryName}
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Tabs: Description | Reviews */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex gap-6 border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-3 font-semibold ${
                activeTab === "description"
                  ? "text-mainBgColor border-b-2 border-mainBgColor"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 font-semibold ${
                activeTab === "reviews"
                  ? "text-mainBgColor border-b-2 border-mainBgColor"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          {activeTab === "description" && (
            <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-line">
              {product.description_long || product.description}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="flex gap-4 py-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                      {rev.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{rev.authorName}</span>
                        <span className="text-sm text-gray-500">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                      <div className="flex text-amber-500 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${star <= rev.rating ? "fill-current" : "fill-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{rev.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <section className="mt-14 border-t border-gray-200 pt-10">
            <h2 className="text-xl font-bold text-gray-900 font-lora mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <SingleProductCard
                  key={p._id}
                  id={p._id}
                  heading={p.cardboardname}
                  minOrder={p.minOrder}
                  imgSrc={p.images?.[0]}
                  images={p.images}
                  dimensions={p.dimensions || { length: "—", width: "—", depth: "—" }}
                  stock={p.quantity}
                  rate={p.rate}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPageAmazon;
