"use client";

import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

const CARDS = [
  {
    image: "/img/inspiration_small_1.png",
    title: "Retail & E-commerce",
    description:
      "Stand out on the shelf and in the mail. Custom boxes for retail and e-commerce that protect your products and reinforce your brand.",
    href: "/quotes",
  },
  {
    image: "/img/inspiration_big_1.png",
    title: "Food & Restaurant",
    description:
      "From takeout to gourmet. Food-safe packaging that keeps meals fresh and presentation sharp for restaurants and food brands.",
    href: "/quotes",
  },
  {
    image: "/img/inspiration_big_2.png",
    title: "Shipping & Mailers",
    description:
      "Durable, reliable shipping solutions. Corrugated mailers and boxes built for safe delivery and a great unboxing experience.",
    href: "/quotes",
  },
];

export default function BoxInspirationsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
      {CARDS.map((card) => (
        <article
          key={card.title}
          className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <h3 className="absolute top-4 left-4 text-white font-lora font-bold text-lg sm:text-xl drop-shadow-md">
              {card.title}
            </h3>
            <Link
              href={card.href}
              className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-white font-inter font-medium text-sm sm:text-base hover:text-headingTxtColor transition-colors drop-shadow-md"
            >
              Explore
              <FaChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="p-5 sm:p-6 text-gray-800 font-inter font-medium text-sm sm:text-base leading-relaxed text-center">
            {card.description}
          </p>
        </article>
      ))}
    </div>
  );
}
