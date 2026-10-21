'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SingleProductCard from '../SingleProductCard';

const PAGE_SIZE = 12;

/**
 * Build dummy products for a category when the API returns none.
 * Shape matches what SingleProductCard and the API expect.
 */
function buildDummyProducts(categoryId, categoryName) {
  const names = [
    'Standard Mailer Box',
    'Small Shipping Box',
    'Medium Corrugated Box',
    'Large Carton Box',
    'Custom Mailer (A4)',
    'Pizza Slice Box',
    'Gift Box Premium',
    'E-commerce Shipping Box',
    'Flat Pack Box',
    'Cube Storage Box',
    'Laptop Mailer Box',
    'Tool Box Heavy Duty',
    'Apparel Box',
    'Subscription Box',
    'Eco Mailer Box',
    'Bulk Ration Box',
    'Restaurant Takeaway Box',
    'Cake Box 12"',
    'Moving Carton Large',
    'Small Parts Box',
  ];
  const dummyList = [];
  for (let i = 0; i < 24; i++) {
    dummyList.push({
      _id: `dummy-${categoryId}-${i + 1}`,
      mainType: categoryId,
      cardboardname: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
      description: '',
      rate: 50 + (i % 20) * 10,
      quantity: 100,
      minOrder: 100 + (i % 5) * 100,
      dimensions: { length: 10 + (i % 15), width: 8 + (i % 10), depth: 6 + (i % 8) },
      images: ['/img/cardboard_header_image.png'],
    });
  }
  return dummyList;
}

/**
 * Product grid with infinite scroll. Uses API products when available, otherwise dummy products.
 */
const CategoryProductGrid = ({ apiProducts, categoryId, categoryName }) => {
  const list = Array.isArray(apiProducts) && apiProducts.length > 0
    ? apiProducts
    : buildDummyProducts(categoryId, categoryName);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(() => {
    if (loadingRef.current) return;
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, list.length));
    loadingRef.current = true;
  }, [list.length]);

  useEffect(() => {
    loadingRef.current = false;
  }, [visibleCount]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visible = list.slice(0, visibleCount);
  const hasMore = visibleCount < list.length;

  return (
    <section className="py-10 px-6 lg:px-14">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl text-headingTxtColor font-lora font-bold mb-8">
          Products In This Category
        </h2>
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 justify-center gap-6 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            <SingleProductCard
              key={product._id}
              id={product._id}
              heading={product.cardboardname}
              minOrder={product.minOrder}
              imgSrc={product.images?.[0]}
              images={product.images}
              dimensions={product.dimensions || { length: '—', width: '—', depth: '—' }}
              stock={product.quantity}
              rate={product.rate}
              categoryName={categoryName}
            />
          ))}
        </div>
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-12">
            <span className="text-gray-500 text-sm">Loading more...</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryProductGrid;
