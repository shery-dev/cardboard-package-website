"use client";

import React, { useEffect } from 'react'
import ShoppingListCard from './ShoppingListCard'
import { useAppContext } from '@/context/Context'

const ShoppingItemList = ({ onItemsChange }) => {
    const { itemsList, setItemsList } = useAppContext()

    useEffect(() => {
        onItemsChange(itemsList.length);
    }, [itemsList, onItemsChange]);

    const handleDeleteItem = (id) => {
        setItemsList(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        setItemsList(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity, price: item.pricePerPiece * newQuantity } : item
            )
        );
    };

    return (
        <>
            <div className=' flex justify-start items-center flex-col gap-2'>
                {itemsList?.length === 0 ? (
                    <p className="text-gray-600 text-center py-8 w-full">No Items Currently In The Cart</p>
                ) : (
                itemsList?.map((item) => (
                        <div
                            key={item.id}
                            className=" w-full px-2 py-2 flex justify-start items-start flex-col md:flex-row gap-4 rounded-lg border border-gray-200 bg-white shadow-md"
                        >
                            <ShoppingListCard
                                id={item.id}
                                name={item.name}
                                imgSrc={item.img}
                                quantity={item.quantity}
                                price={item.price}
                                pieceLabel={item.pieceLabel}
                                designViewUrl={item.designViewUrl}
                                categoryPath={item.categoryPath}
                                dimension={item.dimension}
                                material={item.material}
                                isCustomBox={!!item.ThreeD || item.categoryPath === "Food and Restaurant > Standard Mailer Box" || item.name === "Custom Box" || item.name === "Standard Mailer Box"}
                                onDelete={handleDeleteItem}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        </div>
                    ))
                )}
            </div>
        </>
    )
}

export default ShoppingItemList;
