'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

/**
 * Amazon-style category page header: name, long description, optional features and image.
 * No quote/form — for use on category product listing pages.
 */
const CategoryHeader = ({ categoryName, descriptionLong, features = [], imgSrc }) => {
  const hasImage = imgSrc && imgSrc.length > 0;
  const imageUrl = Array.isArray(imgSrc) ? imgSrc[0] : imgSrc;

  return (
    <div className="bg-grayPink">
      <div className="container mx-auto py-12 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-10 min-h-[420px]">
          <motion.div
            className={`flex flex-col pl-6 lg:pl-12 ${hasImage ? 'lg:w-1/2 lg:min-h-[420px]' : 'w-full'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-lora text-headingTxtColor mb-6">
              {categoryName}
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-inter leading-relaxed flex-1 min-h-[140px]">
              {descriptionLong}
            </p>
            {features && features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <span className="text-mainBgColor mr-2 shrink-0">
                      <FaCheck />
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          {hasImage && imageUrl && (
            <motion.div
              className="lg:w-1/2 w-full flex justify-center lg:justify-end lg:min-h-[420px] pr-6 lg:pr-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md min-h-[320px] lg:min-h-[420px] rounded-br-[50px] overflow-hidden shadow-lg bg-white p-4">
                <Image
                  src={imageUrl.startsWith('/') ? imageUrl : `/api/v1/fetchImg/${imageUrl}`}
                  alt={categoryName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
