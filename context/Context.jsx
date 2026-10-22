"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BOX_PRESETS, getPresetById } from "@/lib/boxPresets";

const AppContext = createContext(null);

export default function AppContextProvider({ children }) {
    const [navOpen, setNavOpen] = useState();
    const [isLogIn, setIsLogIn] = useState(false)
    const [orderCreated, setOrderCreated] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [imagePositions, setImagePositions] = useState({});
    const [imageSizes, setImageSizes] = useState({});
    const [imageRotations, setImageRotations] = useState({});
    const [box, setBox] = useState("mailerbox");
    const [activeBoxPreset, setActiveBoxPreset] = useState(BOX_PRESETS[16]); // Standard Mailer Box default

    const [images, setImages] = useState({});
    const [itemsList, setItemsList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Calculate total price whenever itemsList changes
        let totalPrice = 0;
        if (itemsList.length > 0) {
            itemsList.forEach(item => {
                totalPrice += item.price;
            });
        }
        setTotalPrice(totalPrice);
    }, [itemsList]);

    // Restore cart from localStorage after mount (avoids hydration mismatch)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('itemsList');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) setItemsList(parsed);
            }
        } catch (_) {}
    }, []);

    useEffect(() => {
        localStorage.setItem("itemsList", JSON.stringify(itemsList));
    }, [itemsList]);

    // Manipulator states...

    const [activeItem, setActiveItem] = useState('size')
    const [isOpen, setIsOpen] = useState(true)
    const [material, setMaterial] = useState("Kraft")
    const [quantity, setQuantity] = useState(500)
    //const [featureProduct, setFeatureProduct] = useState("featureproduct")
    const [selectedSize, setSelectedSize] = useState({
        length: 10,
        width: 10,
        depth: 4
    })
    const [extTexImg, setExtTexImg] = useState('MailerBoxOuterTex-Kraft.png')
    const [extTexColor, setExtTexColor] = useState('#C7A882')
    const [selectedColor, setSelectedColor] = useState('#C7A882')
    const [selectedSide, setSelectedSide] = useState('topFront')
    const [extTexImgBlob, setExtTexImgBlob] = useState(null)
    const [viewType, setViewType] = useState(null)
    const [selectedFeatureProduct, setSelectedFeatureProduct] = useState(null)

    const [sideColors, setSideColors] = useState({
        lidFront: '#C7A882',
        top: '#C7A882',
        back: '#C7A882',
        bottom: '#C7A882',
        front: '#C7A882',
        left: '#C7A882',
        right: '#C7A882',
        lidTop: '#C7A882',
        lidRight: '#C7A882',
        lidLeft: '#C7A882',
        bottomFront: '#C7A882',
        bottomBack: '#C7A882',
        bottomLeft: '#C7A882',
        bottomRight: '#C7A882'
    })
   
    useEffect(() => {
        if ( box === "mailerbox" ){
            if (material === 'Kraft') {
                setExtTexColor('#C7A882')
                setExtTexImg('MailerBoxOuterTex-Kraft.png')
                setSideColors({
                    lidFront: '#C7A882',
                    top: '#C7A882',
                    back: '#C7A882',
                    bottom: '#C7A882',
                    front: '#C7A882',
                    left: '#C7A882',
                    right: '#C7A882'
                })
            } else if (material === 'Dreamcoat') {
                setExtTexColor('#FAF5EE')
                setExtTexImg('MailerBoxOuterTex-Dreamcoat.png')
                setSideColors({
                    lidFront: '#FAF5EE',
                    top: '#FAF5EE',
                    back: '#FAF5EE',
                    bottom: '#FAF5EE',
                    front: '#FAF5EE',
                    left: '#FAF5EE',
                    right: '#FAF5EE'
                })
            } else if (material === 'White') {
                setExtTexColor('#FFFFFF')
                setExtTexImg('MailerBoxOuterTex-White.png')
                setSideColors({
                    lidFront: '#FFFFFF',
                    top: '#FFFFFF',
                    back: '#FFFFFF',
                    bottom: '#FFFFFF',
                    front: '#FFFFFF',
                    left: '#FFFFFF',
                    right: '#FFFFFF'
                })
            }
        }
        else if (box==="pizzaBox") {
            if (material === 'Kraft') {
                setExtTexColor('#C7A882')
                setExtTexImg('pizzaBoxExtTex-kraft.png')
                setSideColors({
                    bottom: '#C7A882',
                    bottomRight: '#C7A882',
                    bottomLeft: '#C7A882',
                    bottomFront: '#C7A882',
                    bottomBack: '#C7A882',
                    lidTop: '#C7A882',
                    lidRight: '#C7A882',
                    lidLeft: '#C7A882',
                    lidFront: '#C7A882',
                    top: '#C7A882',
                    front: '#C7A882'
                })
            } else if (material === 'Dreamcoat') {
                setExtTexColor('#FAF5EE')
                setExtTexImg('pizzaBoxExtTex-dreamcoat.png')
                setSideColors({
                    bottom: '#FAF5EE',
                    bottomRight: '#FAF5EE',
                    bottomLeft: '#FAF5EE',
                    bottomFront: '#FAF5EE',
                    bottomBack: '#FAF5EE',
                    lidTop: '#FAF5EE',
                    lidRight: '#FAF5EE',
                    lidLeft: '#FAF5EE',
                    lidFront: '#FAF5EE',
                    top: '#FAF5EE',
                    front: '#FAF5EE'
                })
            } else if (material === 'White') {
                setExtTexColor('#FFFFFF')
                setExtTexImg('pizzaBoxExtTex-white.png')
                setSideColors({
                    bottom: '#FFFFFF',
                    bottomRight: '#FFFFFF',
                    bottomLeft: '#FFFFFF',
                    bottomFront: '#FFFFFF',
                    bottomBack: '#FFFFFF',
                    lidTop: '#FFFFFF',
                    lidRight: '#FFFFFF',
                    lidLeft: '#FFFFFF',
                    lidFront: '#FFFFFF',
                    top: '#FFFFFF',
                    front: '#FFFFFF'
                })
            }
        }
        else if (box==="shippingBox") {
            if (material === 'Kraft') {
                setExtTexColor('#C7A882')
                setExtTexImg('SBD.png')
                setSideColors({
                    front: '#C7A882',
                    left: '#C7A882',
                    right: '#C7A882',
                    back: '#C7A882',
                    bottom: '#C7A882',
                    top: '#C7A882',
                    lidFront: '#C7A882'
                })
            } else if (material === 'Dreamcoat') {
                setExtTexColor('#FAF5EE')
                setExtTexImg('ShippingBoxDreamcoatOuterTexture.png')
                setSideColors({
                    front: '#FAF5EE',
                    left: '#FAF5EE',
                    right: '#FAF5EE',
                    back: '#FAF5EE',
                    bottom: '#FAF5EE',
                    top: '#FAF5EE',
                    lidFront: '#FAF5EE'
                })
            } else if (material === 'White') {
                setExtTexColor('#FFFFFF')
                setExtTexImg('ShippingBoxWhiteOuterTexture.png')
                setSideColors({
                    front: '#FFFFFF',
                    left: '#FFFFFF',
                    right: '#FFFFFF',
                    back: '#FFFFFF',
                    bottom: '#FFFFFF',
                    top: '#FFFFFF',
                    lidFront: '#FFFFFF'
                })
            }
        }
        else {
            if (material === 'Kraft') {
                setExtTexColor('#C7A882');
                setExtTexImg('kraftTexture.jpg');
                setSideColors({
                    front: '#C7A882',
                    left: '#C7A882',
                    right: '#C7A882',
                    back: '#C7A882',
                    bottom: '#C7A882',
                    top: '#C7A882',
                    lidFront: '#C7A882',
                    lid: '#C7A882'
                });
            } else if (material === 'Dreamcoat') {
                setExtTexColor('#FAF5EE');
                setExtTexImg('dreamCoatTexture.jpg');
                setSideColors({
                    front: '#FAF5EE',
                    left: '#FAF5EE',
                    right: '#FAF5EE',
                    back: '#FAF5EE',
                    bottom: '#FAF5EE',
                    top: '#FAF5EE',
                    lidFront: '#FAF5EE',
                    lid: '#FAF5EE'
                });
            } else if (material === 'White') {
                setExtTexColor('#FFFFFF');
                setExtTexImg('whiteCoatTexture.jpg');
                setSideColors({
                    front: '#FFFFFF',
                    left: '#FFFFFF',
                    right: '#FFFFFF',
                    back: '#FFFFFF',
                    bottom: '#FFFFFF',
                    top: '#FFFFFF',
                    lidFront: '#FFFFFF',
                    lid: '#FFFFFF'
                });
            }
        }
        

    }, [material,box])

    const selectBoxPreset = useCallback((presetIdOrObject) => {
        const preset = typeof presetIdOrObject === "string" ? getPresetById(presetIdOrObject) : presetIdOrObject;
        if (!preset) return;
        setActiveBoxPreset(preset);
        setBox(preset.modelType);
        if (preset.defaultSize) {
            setSelectedSize({
                length: Number(preset.defaultSize.length) || 10,
                width: Number(preset.defaultSize.width) || 10,
                depth: Number(preset.defaultSize.depth) || 10
            });
        }
        setSelectedFeatureProduct(null);
        setExtTexImgBlob(null);
    }, []);

    return (
        <AppContext.Provider
            value={{
                navOpen,
                setNavOpen,
                itemsList,
                setItemsList,
                totalPrice,
                isLogIn,
                setIsLogIn,
                activeItem,
                setActiveItem,
                isOpen,
                setIsOpen,
                material,
                setMaterial,
                selectedSize,
                setSelectedSize,
                extTexImg,
                setExtTexImg,
                extTexColor,
                setExtTexColor,
                sideColors,
                setSideColors,
                selectedColor,
                setSelectedColor,
                selectedSide,
                setSelectedSide,
                quantity,
                setQuantity,
                extTexImgBlob,
                setExtTexImgBlob,
                orderCreated,
                setOrderCreated,
                isCreatingOrder,
                setIsCreatingOrder,
                viewType,
                setViewType,
                selectedFeatureProduct,
                setSelectedFeatureProduct,
                imagePositions,
                setImagePositions,
                imageSizes,
                setImageSizes, 
                imageRotations,
                setImageRotations,
                images,
                setImages,
                box,
                setBox,
                activeBoxPreset,
                setActiveBoxPreset,
                selectBoxPreset,
                BOX_PRESETS
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext)

    if (!context) {
        throw new Error(
            "Context must be used within the AppContextProvider"
        )
    }
    return context
}
