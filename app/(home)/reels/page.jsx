"use client";

import FormContainer from "@/components/FormContainer";
import HeadingAndIntro from "@/components/HeadingAndIntro";
import ImageGallery from "@/components/ImageGallery";
import ProductsContainer from "@/components/ProductsContainer";
import ReelConfigForm from "@/components/ReelsPage/ReelConfigForm";
import ReeTypesList from "@/components/ReelsPage/ReelsTypesList";
import { useEffect, useState } from "react";

async function getReelsData() {
  try {
    const res = await fetch("/api/v1/getReels");
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    let data = await res.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return null; // Return null or appropriate default data in case of error
  }
}

export default function Reels() {
  const imgSrc = {
    img1: "/img/reels_usage_small_1.png",
    img2: "/img/reels_usage_small_2.png",
    img3: "/img/reels_usage_big_1.png",
    img4: "/img/reels_usage_small_3.png",
    img5: "/img/reels_usage_small_4.png",
    img6: "/img/reels_usage_big_2.png",
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const reelsData = await getReelsData();
      setData(reelsData);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="bg-gray-300">
        <FormContainer
          heading={"Reels"}
          introPara={"Paper reels are an integral part of the paper industry and serve various purposes, from packaging and printing to manufacturing paper products. These reels are formed by winding a continuous length of paper onto a cylindrical core, creating a versatile and sturdy format that can be used for a wide range of applications. The quality and thickness of the paper used for these reels can be tailored to suit the specific needs of businesses, providing a customizable solution for printing and packaging requirements."}
          imgSrc={"/img/reels_header_image.png"}
          formComp={
            <ReelConfigForm
              data={data}
            />
          }
        />
      </div>
      <div className="mt-16 mb-10 py-4">
        <ProductsContainer
          heading={"Types of Reels"}
          productList={
            <ReeTypesList
              data={data ? data.data : null}
            />
          }
        />
      </div>
      <div className="mt-16 mb-10 py-4">
        <HeadingAndIntro
          heading={"Reels Usage"}
          intro={"At the heart of our packaging solutions lies the versatile and dynamic roll. Our expertise in roll-based packaging allows us to provide practical solutions for all kinds of businesses. Whether you're looking to elevate your brand with custom retail packaging on rolls that showcase your logo, or need corrugated cardboard mailers on rolls to streamline your e-commerce operations, we're here to ignite your imagination and inspire your product."}
          component={
            <ImageGallery
              imgSrc={imgSrc}
            />}
        />
      </div>
    </>
  );
}
