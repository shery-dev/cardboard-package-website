"use client";

import { Card, Button, FloatingLabel } from 'flowbite-react';
import Link from 'next/link';
import { getData } from '@/app/(home)/cardboard/products-list/[id]/page';
import { getMaterils } from '@/app/(home)/product-display/[id]/page';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/Context';
import { useParams } from 'next/navigation';

const SubProConfigForm = ({ data }) => {
    const [subProducts, setSubProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [materials, setMaterials] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null)
    const [materialDetails, setMaterialDetails] = useState(null)
    const [pricePerPiece, setPricePerPiece] = useState(0)
    const [quantity, setQuantity] = useState(500);
    const [thickness, setThickness] = useState(null);
    const [printedSides, setPrintedSides] = useState(null);
    const [price, setPrice] = useState(0)
    const [boxLen, setBoxLen] = useState(0)
    const [boxWid, setBoxWid] = useState(0)
    const [boxDep, setBoxDep] = useState(0)

    const id = useParams().id;


    const [formType, setFormType] = useState('standard')

    const { setItemsList } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await getData(id);
            setSubProducts(fetchedData)
        };
        const fetchMaterials = async () => {
            const fetchedData = await getMaterils();
            setMaterials(fetchedData);
        };
        if (id) {
            fetchData();
            fetchMaterials()
        } else {
            setSubProducts([])
            setMaterials(null)
            setSelectedMaterial(null)
            setSelectedProduct(null)
            setThickness(null)
            setPrintedSides(null)
            setBoxLen(0)
            setBoxWid(0)
            setBoxDep(0)
        }
    }, [id, selectedProduct]);

    useEffect(() => {
        setMaterials(null)
        setSelectedMaterial(null)
        setThickness(null)
        setPrintedSides(null)
        setBoxLen(0)
        setBoxWid(0)
        setBoxDep(0)
    }, [selectedProduct]);

    useEffect(() => {
        if (data && quantity) {
            const material = materials?.find((mat) => mat.materailName === selectedMaterial);
            setMaterialDetails(material);
            const pricePerSheet =
                (((boxLen * boxWid * 210) / 15500) *
                    material?.paperRate) /
                100;
            const pricePerRoll =
                (boxWid * material?.rollRate) /
                (2400 / boxLen);
            const pricePerPiece = Number.parseFloat(
                (pricePerSheet + pricePerRoll + 14 + 5 + 2).toFixed(0)
            );

            setPricePerPiece(pricePerPiece);

            const price = pricePerPiece * quantity;
            setPrice(price);
        }
    }, [data, subProducts, materials, selectedMaterial, quantity, boxLen, boxDep, boxWid]);

    useEffect(() => {
        if (selectedProduct?.dimensions) {
            setBoxLen(selectedProduct?.dimensions?.length)
            setBoxWid(selectedProduct?.dimensions?.width)
            setBoxDep(selectedProduct?.dimensions?.depth)
        }
    }, [subProducts, selectedProduct, formType])


    const handleClick = () => {
        if (price) {
            const item = {
                id: selectedProduct?._id,
                ThreeD: false,
                name: selectedProduct?.cardboardname,
                img: selectedProduct?.images[0],
                quantity: quantity,
                pricePerPiece: pricePerPiece,
                price: price,
                dimension: {
                    width: boxWid,
                    length: boxLen,
                    depth: boxDep
                },
                printedSides: 4,
                material: selectedMaterial?.materailName,
                thickness: 3,
            };
            setItemsList((prev) => [...prev, item])
            window.scroll(0, 0);
            setSubProducts([])
            setMaterials(null)
            setSelectedProduct(null)
            setThickness(null)
            setPrintedSides(null)
        }
    };

    return (
        <>
            <Card className=" w-full">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <h5 className="text-xl font-bold leading-none text-gray-800">Configure & Price</h5>
                    <Link href="#" className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                        Share
                    </Link>
                </div>
                <hr class="h-px bg-gray-300 border-0"></hr>
                <form className="flex flex-col gap-4">
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="underline_select" className=" w-1/4 text-headingTxtColor">Sub-Product:</label>
                        <select
                            id="underline_select"
                            className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedProduct(JSON.parse(e.target.value))
                                } else {
                                    setSelectedProduct(null)
                                }
                            }}
                            disabled={!id}
                        >
                            <option value="">Choose a sub-product</option>
                            {
                                subProducts?.map((subProd) => (
                                    <option
                                        key={subProd._id}
                                        value={JSON.stringify(subProd)}
                                    >
                                        {subProd?.cardboardname}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="underline_select" className=" w-1/4 text-headingTxtColor">Material:</label>
                        <select
                            id="underline_select"
                            className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                            disabled={!selectedProduct}
                        >
                            <option value="">Choose a material</option>
                            {
                                materials?.map((material) => (
                                    <option
                                        key={material._id}
                                        value={material.materailName}
                                    >
                                        {material.materailName}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="underline_select" className="w-1/4 text-headingTxtColor">Thickness:</label>
                        <select
                            id="underline_select"
                            className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={(e) => setThickness(e.target.value)}
                            disabled={!selectedMaterial}
                        >
                            <option value={null}>Choose a thickness</option>
                            <option value="3">3 Ply</option>
                            <option value="5">5 Ply</option>
                            <option value="7">7 Ply</option>
                        </select>
                    </div>
                    <div className=" flex justify-between items-center flex-row">
                        <div htmlFor="underline_select" className="w-1/4"></div>
                        <div className=' w-3/4 flex justify-center items-center gap-4 flex-row'>
                            <Button
                                onClick={() => setFormType('standard')}
                                gradientDuoTone="redToYellow"
                                outline={formType === 'standard' ? false : true}
                            >
                                Standard Sizes
                            </Button>
                            <Button
                                onClick={() => setFormType('custom')}
                                gradientDuoTone="redToYellow"
                                outline={formType === 'custom' ? false : true}
                            >
                                Custom Sizes
                            </Button>
                        </div>
                    </div>
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="dimension" className="w-1/4 text-headingTxtColor">Dimensions:</label>
                        {
                            formType === 'standard' ? (
                                <span
                                    id="dimension"
                                    className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                                >
                                    {
                                        selectedProduct?.dimensions ?
                                            selectedProduct?.dimensions?.length + " X " + selectedProduct?.dimensions?.width + " X " + selectedProduct?.dimensions?.depth :
                                            "Please select necessary fields!"
                                    }
                                </span>
                            ) : (
                                <span className=' flex justify-between items-center flex-row gap-4'>
                                    <FloatingLabel
                                        variant="standard"
                                        label="Length"
                                        className=' w-28'
                                        value={boxLen}
                                        onChange={(e) => setBoxLen(e.target.value)}
                                    />
                                    <FloatingLabel
                                        variant="standard"
                                        label="Width"
                                        className=' w-28'
                                        value={boxWid}
                                        onChange={(e) => setBoxWid(e.target.value)}
                                    />
                                    <FloatingLabel
                                        variant="standard"
                                        label="Depth"
                                        className=' w-28'
                                        value={boxDep}
                                        onChange={(e) => setBoxDep(e.target.value)}
                                    />
                                </span>
                            )
                        }
                    </div>
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="underline_select" className="w-1/4 text-headingTxtColor">Printed Sides:</label>
                        <select id="underline_select" className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                            <option selected>Choose a side</option>
                            <option value="US">4 Sides</option>
                            <option value="CA">6 Sides</option>
                            <option value="FR">4 Inner Sides</option>
                        </select>
                    </div>
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="underline_select" className="w-1/4 text-headingTxtColor">Quantity:</label>
                        <input
                            type='number'
                            id="underline_select"
                            className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            min={500}
                            step={500}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            onKeyDown={(e) => e.preventDefault()}
                            onWheel={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className=" flex justify-center items-center flex-row gap-4">
                        <label htmlFor="underline_select" className=" text-mainBgColor text-3xl font-bold">Rs. {price ? price : 0}</label>
                        <span
                            id="underline_select"
                            className=" text-gray-600 text-sm"
                        >
                            = (Rs. {pricePerPiece ? pricePerPiece : 0} each X {quantity})
                        </span>
                    </div>
                    <Button
                        gradientDuoTone="pinkToOrange"
                        disabled={price ? false : true}
                        onClick={(e) => {
                            e.preventDefault()
                            handleClick()
                        }}
                    >
                        Add to Cart
                    </Button>
                </form>
            </Card >
        </>
    )
}

export default SubProConfigForm