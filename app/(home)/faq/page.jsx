"use client";

import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "Can I get an instant quote for my order?",
    a: "Yes. Use our free 3D box designer to choose size, material, and quantity—you’ll see a live quote and unit price as you customize. Add colors or artwork and the price updates in real time.",
  },
  {
    q: "What packaging products can I order?",
    a: "We offer custom cardboard Shipping Boxes, Mailer Boxes, and Product Boxes in stock and custom sizes, with low minimums. Ideal for retail and ecommerce. Our Mailer and Shipping boxes are safe to mail; Product Boxes are great for display or to ship inside another box. Get started in our box designer to create your packaging today.",
  },
  {
    q: "How does your 3D box designer work?",
    a: "Design your box in 3D on our tool: set dimensions, pick material, add colors and artwork. Pricing updates as you go. When you’re done, you can checkout, save your design for later, or share it.",
  },
  {
    q: "What is the turnaround time on my order?",
    a: "Standard production is about 10 business days; Rush is about 7 business days. Shipping adds 1–7 business days depending on your location. Special or bulk orders may need a few extra days. Delivery dates at checkout are our best estimate; for time-sensitive orders we recommend Rush production and expedited shipping.",
  },
  {
    q: "Do I get a proof before printing?",
    a: "Yes. After you order, our Prepress team reviews your design and emails you a 2D digital proof within 24 hours. You can send change requests through the proof page and we’ll help finalize your design for printing.",
  },
  {
    q: "What choices affect my pricing?",
    a: "Price depends on box dimensions, style, ink coverage, material, and quantity—larger orders get better rates. Orders of 5,000+ may qualify for volume discounts. If you have questions about pricing, our team is happy to help.",
  },
  {
    q: "What if I'm designing in Adobe Illustrator?",
    a: "If you’re using one of our Illustrator templates, you can submit your file via our Dieline Upload tool and we’ll send you a quote. You can also email your dieline to our support team. Without artwork yet? Get a rough quote by applying a solid color on the panels in our 3D design tool where you want print.",
  },
  {
    q: "How do I know if my art is printable?",
    a: "Our Prepress team checks your design for technical issues (resolution, bleeds, thin lines, etc.) and notes them on your proof. They don’t check spelling or grammar or give design opinions—but they’re happy to help you fix any print concerns they flag.",
  },
  {
    q: "Can you print inside the boxes?",
    a: "Yes. We can print on the inside of our Mailers, Shipping Boxes, and Tuck Tops. Product Boxes are exterior print only. You can design the inside in our box designer; for some styles we need a 2D dieline for both interior and exterior. Contact us to set up custom interior print.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 sm:py-16 lg:px-14 max-w-4xl">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-headingTxtColor">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">FAQ</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-lora text-headingTxtColor mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          Below you&apos;ll find answers to some common questions around creating a custom box. Every order is a little different though, so don&apos;t hesitate to{" "}
          <Link href="/quotes" className="text-headingTxtColor font-medium hover:underline">
            reach out
          </Link>{" "}
          with anything else you might be wondering.
        </p>

        <dl className="space-y-10">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-gray-200 pb-8 last:border-0">
              <dt className="text-lg sm:text-xl font-semibold text-gray-900 font-lora mb-3">
                {item.q}
              </dt>
              <dd className="text-gray-700 leading-relaxed whitespace-pre-line">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link
            href="/quotes"
            className="inline-flex items-center gap-2 bg-headingTxtColor hover:bg-headingTxtColor/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
