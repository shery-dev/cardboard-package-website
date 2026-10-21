"use client"

import ImagesContainer from "@/components/ImageMagnifier/ImagesContainer";
import RollDP from "@/components/RollPage/RollDP";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

async function getRollById(id) {
    try {
      const res = await fetch(`/api/v1/getRollById/${id}`, {
        method: "GET"
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await res.json();
      return jsonData.data;
    } catch (error) {
      console.error('API request failed:', error);
      return null; // Return null to signify failure
    }
  }

const RollsDisplay = () => {
    const id = useParams().id;
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await getRollById(id);
            setData(fetchedData);
        };
        fetchData()
    }, [id])

    return (
        <div className=' flex justify-between items-start flex-col mx-2 lg:flex-row xl:flex-row lg:mx-12 xl:mx-12'>
            <div className=" w-1/2">
                <ImagesContainer img={data ? data.images : null} />
            </div>
            <div className=" w-1/2">
                <RollDP 
                    data={data}
                />
            </div>
        </div>
    )
}

export default RollsDisplay