"use client";

import FormContainer from "@/components/FormContainer";
import HeadingAndIntro from "@/components/HeadingAndIntro";
import ImageGallery from "@/components/ImageGallery";
import ProductsContainer from "@/components/ProductsContainer";
import RollConfigForm from "@/components/RollPage/RollConfigForm";
import RollTypesList from "@/components/RollPage/RollTypesList";
import { useEffect, useState } from "react";

export async function getRollData() {
  try {
    const res = await fetch("/api/v1/getRolls");
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return null; // Return null or appropriate default data in case of error
  }
}

export default function Rolls() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const rollsData = await getRollData();
      setData(rollsData);
    };
    fetchData();
  }, []);

  const imgSrc = {
    img1: "/img/roll-inspiration_small_1.png",
    img2: "/img/roll-inspiration_small_2.png",
    img3: "/img/roll-inspiration_big_1.png",
    img4: "/img/roll-inspiration_small_3.png",
    img5: "/img/roll-inspiration_small_4.png",
    img6: "/img/roll-inspiration_big_2.png",
  };

  return (
    <>
      <div className="bg-rollBg">
        <FormContainer
          heading={"Rolls"}
          introPara={"Cardboard rolls, also known as paper tubes, are cylindrical structures made from paperboard material. They are typically used for packaging purposes, such as holding rolls of paper, fabric, or other materials. Additionally, cardboard rolls have a wide range of other uses, from crafting projects to building construction."}
          imgSrc={"/img/rolls 1.png"}
          formComp={<RollConfigForm />}
        />
      </div>
      <div className="mt-16 mb-10 py-4">
        <ProductsContainer
          heading={"Types of Rolls"}
          productList={
            <RollTypesList
              data={data ? data : null}
            />
          }
        />
      </div>
      <div className="mt-16 mb-10 py-4">
        <HeadingAndIntro
          heading={"Roll Inspirations"}
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