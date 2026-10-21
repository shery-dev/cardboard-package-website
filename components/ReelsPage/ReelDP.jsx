import { useEffect, useState } from "react";
import { Button, Select } from "flowbite-react";
import { useAppContext } from "@/context/Context";

const ReelDP = ({ data, handleRecieveImages }) => {
    const [size, setSize] = useState({});
    const [weights, setWeights] = useState([])
    const [weight, setWeight] = useState(null);
    const [price, setPrice] = useState(0);

    const {setItemsList} = useAppContext();

    const handleClick = () => {
        if (price) {
            const item = {
                id: data?._id,
                ThreeD: false,
                name: data?.Type,
                img: weight?.images[0],
                quantity: 1,
                pricePerPiece: price,
                price: price,
                thickness: 3,
            };
            setItemsList((prev) => [...prev, item])
            window.scroll(0, 0);
        }
    };
    useEffect(() => {
        const initSize = JSON.stringify(data?.Sizes[0])
        const initWeight = JSON.stringify(data?.Sizes[0]?.Weight[0])
        if (initSize && initWeight) {
            setSize(JSON.parse(initSize))
            setWeight(initWeight)
        }
    }, [data])

    useEffect(() => {
        if (size.Weight) {
            setWeights(size?.Weight)
            setWeight(size?.Weight[0])
        }
    }, [size])

    useEffect(() => {
        handleRecieveImages(weight)
    }, [weight])


    useEffect(() => {
        if (weight?.weight_type) {
            setPrice(weight.weight_type * weight.Rate)
        }
    }, [data, size, weight])




    return (
        <div className=" my-2">
            <h2 className=" capitalize font-bold text-3xl">{data?.Type}</h2>
            <p className="my-2 font-normal text-justify">{data?.description}</p>
            <hr className="bg-gray-300 border-1 border-top border-gray-300" />

            <ul className=" my-2">
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Sizes</span>
                    <Select
                        className=" w-36 border-gray-300 bg-gray-50 text-gray-900 focus:border-mainBgColor focus:ring-mainBgColor"
                        onChange={(e) => {
                            setSize(() => JSON.parse(e.target.value));
                        }}
                    >
                        {data?.Sizes?.map((size) => (
                            <option key={size?.Size} value={JSON.stringify(size)}>{size?.Size}</option>
                        ))}
                    </Select>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Weights</span>
                    <Select
                        className=" w-36 border-gray-300 bg-gray-50 text-gray-900 focus:border-mainBgColor focus:ring-mainBgColor"
                        onChange={(e) => {
                            setWeight(() => JSON.parse(e.target.value));
                        }}
                    >
                        {weights?.map((weight) => (
                            <option key={weight?._id} value={JSON.stringify(weight)}>{weight?.weight_type}</option>
                        ))}
                    </Select>
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

export default ReelDP;
