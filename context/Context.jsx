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
    const [extTexColor, setExtTexColor] = useState('#9f6e33')
    const [selectedColor, setSelectedColor] = useState('#9f6e33')
    const [selectedSide, setSelectedSide] = useState('topFront')
    const [extTexImgBlob, setExtTexImgBlob] = useState(null)
    const [viewType, setViewType] = useState(null)
    const [selectedFeatureProduct, setSelectedFeatureProduct] = useState(null)

    const [sideColors, setSideColors] = useState({
        lidFront: '',
        top: '',
        back: '',
        bottom: '',
        front: '',
        left: '',
        right: ''
    })
   
    useEffect(() => {
        if ( box === "mailerbox" ){
            if (material === 'Kraft') {
                setExtTexColor('#9f6e33')
                setExtTexImg('MailerBoxOuterTex-Kraft.png')
                setSideColors({
                    lidFront: '#8d5c1c',
                    top: '#8d5c1c',
                    back: '#8d5c1c',
                    bottom: '#8d5c1c',
                    front: '#8d5c1c',
                    left: '#8d5c1c',
                    right: '#8d5c1c'
                })
            } else if (material === 'Dreamcoat') {
                setExtTexColor('#c8b084')
                setExtTexImg('MailerBoxOuterTex-Dreamcoat.png')
                setSideColors({
                    lidFront: '#cfb994',
                    top: '#cfb994',
                    back: '#cfb994',
                    bottom: '#cfb994',
                    front: '#cfb994',
                    left: '#cfb994',
                    right: '#cfb994'
                })
            } else if (material === 'White') {
                setExtTexColor('#e8e8e8')
                setExtTexImg('MailerBoxOuterTex-White.png')
                setSideColors({
                    lidFront: '#d3d2d2',
                    top: '#d3d2d2',
                    back: '#d3d2d2',
                    bottom: '#d3d2d2',
                    front: '#d3d2d2',
                    left: '#d3d2d2',
                    right: '#d3d2d2'
                })
            }
        }
        else if (box==="pizzaBox") {
            if (material === 'Kraft') {
                setExtTexColor('#9f6e33')
                setExtTexImg('pizzaBoxExtTex-kraft.png')
                setSideColors({
                    bottom: '#8d5c1c',
                    bottomRight: '#8d5c1c',
                    bottomLeft: '#8d5c1c',
                    bottomFront: '#8d5c1c',
                    bottomBack: '#8d5c1c',
                    lidTop: '#8d5c1c',
                    lidRight: '#8d5c1c',
                    lidLeft: '#8d5c1c',
                    lidFront: '#8d5c1c'
                })
            } else if (material === 'Dreamcoat') {
                setExtTexColor('#c8b084')
                setExtTexImg('pizzaBoxExtTex-dreamcoat.png')
                setSideColors({
                    
                    bottom: '#cfb994',
                    bottomRight: '#cfb994',
                    bottomLeft: '#cfb994',
                    bottomFront: '#cfb994',
                    bottomBack: '#cfb994',
                    lidTop: '#cfb994',
                    lidRight: '#cfb994',
                    lidLeft: '#cfb994',
                    lidFront: '#cfb994'
                })
            } else if (material === 'White') {
                setExtTexColor('#e8e8e8')
                setExtTexImg('pizzaBoxExtTex-white.png')
                setSideColors({
                    
                    bottom: '#d3d2d2',
                    bottomRight: '#d3d2d2',
                    bottomLeft: '#d3d2d2',
                    bottomFront: '#d3d2d2',
                    bottomBack: '#d3d2d2',
                    lidTop: '#d3d2d2',
                    lidRight: '#d3d2d2',
                    lidLeft: '#d3d2d2',
                    lidFront: '#d3d2d2'
                })
            }
        }
        else if (box==="shippingBox") {
            if (material === 'Kraft') {
                setExtTexColor('#9f6e33')
                setExtTexImg('SBD.png')
                setSideColors({
                    front: '#8d5c1c',
                    left: '#8d5c1c',
                    right: '#8d5c1c',
                    back: '#8d5c1c',
                    bottom: '#8d5c1c',
                    
                })
            } else if (material === 'Dreamcoat') {
                setExtTexColor('#c8b084')
                setExtTexImg('ShippingBoxDreamcoatOuterTexture.png')
                setSideColors({
                    
                    front: '#cfb994',
                    left: '#cfb994',
                    right: '#cfb994',
                    back: '#cfb994',
                    bottom: '#cfb994',
                    
                })
            } else if (material === 'White') {
                setExtTexColor('#e8e8e8')
                setExtTexImg('ShippingBoxWhiteOuterTexture.png')
                setSideColors({
                    
                    front: '#d3d2d2',
                    left: '#d3d2d2',
                    right: '#d3d2d2',
                    back: '#d3d2d2',
                    bottom: '#d3d2d2',
                    
                })
            }
        }
        else {
            if (material === 'Kraft') {
                setExtTexColor('#9f6e33');
                setExtTexImg('kraftTexture.jpg');
                setSideColors({
                    front: '#8d5c1c',
                    left: '#8d5c1c',
                    right: '#8d5c1c',
                    back: '#8d5c1c',
                    bottom: '#8d5c1c',
                });
            } else if (material === 'Dreamcoat') {
                setExtTexColor('#c8b084');
                setExtTexImg('dreamCoatTexture.jpg');
                setSideColors({
                    front: '#cfb994',
                    left: '#cfb994',
                    right: '#cfb994',
                    back: '#cfb994',
                    bottom: '#cfb994',
                });
            } else if (material === 'White') {
                setExtTexColor('#e8e8e8');
                setExtTexImg('whiteCoatTexture.jpg');
                setSideColors({
                    front: '#d3d2d2',
                    left: '#d3d2d2',
                    right: '#d3d2d2',
                    back: '#d3d2d2',
                    bottom: '#d3d2d2',
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
