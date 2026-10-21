"use client"

import ImagesContainer from "@/components/ImageMagnifier/ImagesContainer";
import ReelDP from "@/components/ReelsPage/ReelDP";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

async function getRollById(id) {
  try {
    const res = await fetch(`/api/v1/getReelById/${id}`, {
      method: "GET"
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const jsonData = await res.json();
    return jsonData.data;
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
}

const ReelsDisplay = () => {
  const id = useParams().id;
  const [data, setData] = useState(null);
  const [images, setImages] = useState([])

  const receiveImages = (weight) => {
    if (weight?.images) {
      setImages(weight.images);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getRollById(id);
      setData(fetchedData);
    };
    fetchData()
  }, [id])

  useEffect(() => {
    if (data?.Sizes) {
      setImages(data?.Sizes[0]?.Weight[0]?.images)
    }
  }, [data])

  return (
    <div className=' flex justify-between items-start flex-col mx-2 lg:flex-row xl:flex-row lg:mx-12 xl:mx-12'>
      <div className=" w-1/2">
        <ImagesContainer img={images ? images : null} />
      </div>
      <div className=" w-1/2">
        <ReelDP
          data={data}
          handleRecieveImages={receiveImages}
        />
      </div>
    </div>
  )
}

export default ReelsDisplay