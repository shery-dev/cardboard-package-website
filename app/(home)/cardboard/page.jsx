"use client";

import CardboardTypesList from "@/components/CardboardPage/CardboardTypesList";
import ConfiguratorForm from "@/components/CardboardPage/ConfiguratorForm";
import FormContainer from "@/components/FormContainer";
import HeadingAndIntro from "@/components/HeadingAndIntro";
import ImageGallery from "@/components/ImageGallery";
import ProductsContainer from "@/components/ProductsContainer";
import { useEffect, useState } from "react";

async function getData() {
  try {
    const res = await fetch("/api/v1/cardboard-types");
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

export default function Cardboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataFetcher = async () => {
      const fetchedData = await getData();
      setData(fetchedData);
    };
    dataFetcher();
  }, []);

  const imgSrc = {
    img1: "/img/cardboard_inspiration_small_1.png",
    img2: "/img/cardboard_inspiration_small_2.png",
    img3: "/img/cardboard_inspiration_big_1.png",
    img4: "/img/cardboard_inspiration_small_3.png",
    img5: "/img/cardboard_inspiration_small_4.png",
    img6: "/img/cardboard_inspiration_big_2.png",
  };

  return (
    <>
      <div className="bg-grayPink">
        <FormContainer
          heading={"Cardboards"}
          introPara={"Discover the perfect packaging solution with our range of corrugated cardboard boxes, designed to meet every need. Whether you're shipping products, mailing items, or packaging food, our sturdy and lightweight boxes provide unbeatable strength and durability, ensuring your goods stay protected and presentable. Choose from shipping boxes for heavy-duty protection, mailer boxes for secure and stylish delivery, or eatable boxes for safe food packaging."}
          imgSrc={"/img/cardboard_header_image.png"}
          formComp={
            <ConfiguratorForm
              data={data?.data}
            />
          }
        />
      </div>
      <div className="mt-16 mb-10 py-4">
        <ProductsContainer
          heading={"Types of Cardboards"}
          productList={
            <CardboardTypesList
              prodTypes={data?.data}
            />
          }
        />
      </div>
      <div className="mt-16 mb-10 py-4">
        <HeadingAndIntro
          heading={"Cardboards Inspirations"}
          intro={"Cardboard packaging is the cornerstone of our packaging solutions. Our mastery in crafting dynamic and adaptable packaging based on this versatile material enables us to deliver solutions that are both functional and innovative."}
          component={
            <ImageGallery
              imgSrc={imgSrc}
            />}
        />
      </div>
    </>
  );
}
