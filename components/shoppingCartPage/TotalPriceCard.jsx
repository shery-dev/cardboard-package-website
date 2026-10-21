"use client";

import { useAppContext } from '@/context/Context';
import React from 'react'

const TotalPriceCard = () => {
    const { totalPrice } = useAppContext()
    return (
        <>
            <span className=' w-full flex justify-between items-center flex-row'>
                <span className=' text-headingTxtColor text-lg font-bold'>Subtotal: </span>
                <span className=' text-gray-700 text-lg font-bold'>$ {Number(totalPrice).toFixed(2)}</span>
            </span>
            
        </>
    )
}

export default TotalPriceCard