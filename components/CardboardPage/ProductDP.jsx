import { useEffect, useState } from "react";
import { Button, TextInput, Select } from "flowbite-react";
import Image from "next/image";
import { useAppContext } from "@/context/Context";

const ProductDP = (props) => {
    const [selectedMaterial, setSelectedMaterial] = useState('White');
    const [quantity, setQuantity] = useState(500);
    const [pricePerPiece, setPricePerPiece] = useState(0);
    const [price, setPrice] = useState(0);
    const [materialDetails, setMaterialDetails] = useState({});

    const {setItemsList} = useAppContext();

    const handleQuantityCounter = (actionType) => {
        if (actionType === 'inc') {
            if (quantity >= 500) {
                setQuantity((prev) => prev + 500);
            } else {
                setQuantity(500);
            }
        } else {
            if (quantity > 500) {
                setQuantity((prev) => prev - 500);
            } else {
                setQuantity(500);
            }
        }
    };

    useEffect(() => {
        if (props.data && quantity) {
            const material = props?.materials?.find((mat) => mat.materailName === selectedMaterial);
            setMaterialDetails(material);
            const pricePerSheet =
                (((props?.data?.dimensions?.length * props?.data?.dimensions?.width * 210) / 15500) *
                    material?.paperRate) /
                100;
            const pricePerRoll =
                (props?.data?.dimensions?.width * material?.rollRate) /
                (2400 / props?.data?.dimensions?.length);
            const pricePerPiece = Number.parseFloat(
                (pricePerSheet + pricePerRoll + 14 + 5 + 2).toFixed(0)
            );

            setPricePerPiece(pricePerPiece);

            const price = pricePerPiece * quantity;
            setPrice(price);
        }
    }, [props?.data, props?.materials, selectedMaterial, quantity]);

    const handleClick = () => {
        if (price) {
            const item = {
                id: props?.data?._id,
                ThreeD: false,
                name: props?.data?.cardboardname,
                img: props?.data?.images[0],
                quantity: quantity,
                pricePerPiece: pricePerPiece,
                price: price,
                dimension: props?.data?.dimensions,
                printedSides: 4,
                material: materialDetails?.materailName,
                thickness: 3,
            };
            setItemsList((prev)=> [...prev, item])
            window.scroll(0, 0);
        }
    };

    return (
        <div className=" my-2">
            <h2 className=" capitalize font-bold text-3xl">{props?.data?.cardboardname}</h2>
            <p className="my-2 font-normal text-justify">{props?.data?.description}</p>
            <hr className="bg-gray-300 border-1 border-top border-gray-300" />

            <ul className=" my-2">
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Dimensions</span>
                    <span>
                        {props?.data?.dimensions?.width}&apos; X {props?.data?.dimensions?.length}&apos; X {" "}
                        {props?.data?.dimensions?.depth}&apos;
                    </span>
                </li>
                <li className="flex justify-between items-start flex-col mb-2">
                    <span className="font-semibold text-gray-900">Material</span>
                    <div className="flex justify-between items-center flex-row gap-4 p-2">
                        <span
                            role="button"
                            className={`flex justify-start items-center flex-col p-1 ${selectedMaterial === 'White' ? 'border border-gray-500' : ''
                                }`}
                            onClick={() => setSelectedMaterial('White')}
                        >
                            <Image
                                width={200}
                                height={200}
                                src="/whiteCoatTexture.jpg"
                                alt="white-material"
                                className="h-12 w-12"
                            />
                            <span>White</span>
                        </span>
                        <span
                            role="button"
                            className={`flex justify-start items-center flex-col p-1 ${selectedMaterial === 'Kraft' ? 'border border-gray-500' : ''
                                }`}
                            onClick={() => setSelectedMaterial('Kraft')}
                        >
                            <Image
                                width={200}
                                height={200}
                                src="/kraftTexture.jpg"
                                alt="kraft-material"
                                className="h-12 w-12"
                            />
                            <span>Kraft</span>
                        </span>
                        <span
                            role="button"
                            className={`flex justify-start items-center flex-col p-1 ${selectedMaterial === 'Dreamcoat' ? 'border border-gray-500' : ''
                                }`}
                            onClick={() => setSelectedMaterial('Dreamcoat')}
                        >
                            <Image
                                width={200}
                                height={200}
                                src="/dreamCoatTexture.jpg"
                                alt="dreamcoat-material"
                                className="h-12 w-12"
                            />
                            <span>Dreamcoat</span>
                        </span>
                    </div>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Thickness</span>
                    <Select gradientDuoTone="pinkToOrange">
                        <option>3 Ply</option>
                        <option>5 Ply</option>
                        <option>7 Ply</option>
                    </Select>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Price Per Piece</span>
                    <span>Rs. {pricePerPiece}</span>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Quantity</span>
                    <span className="flex justify-end items-center flex-row gap-2">
                        <Button
                            className=" border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover"
                            onClick={() => handleQuantityCounter('dec')}
                        >
                            -
                        </Button>
                        <TextInput type="text" className=" w-20" value={quantity} disabled readOnly />
                        <Button
                            className=" border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover"
                            onClick={() => handleQuantityCounter('inc')}
                        >
                            +
                        </Button>
                    </span>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Total Price</span>
                    <span>Rs. {price}</span>
                </li>
                <li className="flex justify-between items-center flex-col mt-4 w-full">
                    <Button
                        className=" w-full border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover "
                        onClick={handleClick}
                    >
                        Add to Cart
                    </Button>
                </li>
            </ul>
        </div>
    );
};

export default ProductDP;
