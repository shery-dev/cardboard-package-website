"use client";

import { useAppContext } from "@/context/Context"
import Sizes from "./toolsContainer/Sizes"
import Materials from "./toolsContainer/Materials"
import Design from "./toolsContainer/Design"
import Quantity from "./toolsContainer/Quantity"
import Products from "./toolsContainer/Products"
import BoxTypes from "./toolsContainer/BoxTypes"
import { useEffect, useState } from "react";
import FeaturesProducts from "./toolsContainer/FeatureProducts";

export async function getData(id) {
    try {
        const res = await fetch(`/api/v1/getProducts/${id}`, {
            method: "GET"
        });
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const jsonData = await res.json();
        return jsonData.data;
    } catch (error) {
        console.error('API request failed:', error);
        return null; // Return null to signify failures
    }
}

const ToolsOptionsContainer = ({ data }) => {
    console.log(data)
    const { activeItem } = useAppContext()
    const [subProduct, setSubProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await getData(data?._id);
            console.log(fetchedData)
            setSubProduct(fetchedData);
        };
        fetchData();
    }, [data]);

    return (
        <>
            {
                activeItem === "boxtype" && <BoxTypes />
            }
            {
                activeItem === "size" && <Sizes subProductData={subProduct} />
            }
            {
                activeItem === "material" && <Materials />
            }
            {
                activeItem === 'design' && <Design initialTab="designer" />
            }
            {
                activeItem === 'text' && <Design initialTab="text" />
            }
            {
                activeItem === 'blueprint' && <Design initialTab="blueprint" />
            }
            {
                activeItem === 'quantity' && <Quantity />
            }
            {
                activeItem === 'product' && <Products />
            }
            {
                activeItem == 'featureproduct' && <FeaturesProducts/>
            }
        </>
    )
}

export default ToolsOptionsContainer