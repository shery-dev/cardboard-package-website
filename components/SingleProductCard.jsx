import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SingleProductCard = (props) => {
    const [id, setId] = useState('')
    const [hoverImg, setHoverImg] = useState(0)
    const params = useParams();

    useEffect(() => {
        setId(params.id)
    }, [])

    const images = props.images && props.images.length > 0 ? props.images : [props.imgSrc].filter(Boolean)
    const displaySrc = images.length > 1 && hoverImg === 1
        ? images[1]
        : (props.imgSrc || images[0])
    const imgUrl = displaySrc?.startsWith("/") ? displaySrc : `/api/v1/fetchImg/${displaySrc}`
    const isKraftPaper = props.categoryName === "Kraft Paper Products"

    return (
        <>
            <article
                className="mb-4 overflow-hidden rounded-xl border text-gray-700 shadow-md duration-500 ease-in-out hover:shadow-xl"
                onMouseEnter={() => images.length > 1 && setHoverImg(1)}
                onMouseLeave={() => setHoverImg(0)}
            >
                <div className="relative h-56 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                    <Image
                        height={224}
                        width={224}
                        src={imgUrl}
                        alt="card_img"
                        className={`w-full h-full object-contain ${isKraftPaper ? "scale-110" : ""}`}
                    />
                </div>

                <div className="p-4">
                    <div className="pb-4">
                        <Link href={`/product-display/${props.id}`} className="capitalize text-lg hover:text-green-600 font-medium duration-500 ease-in-out">{props.heading}</Link>
                    </div>

                    <ul className="box-border border-t border-solid border-gray-200 m-0 flex list-none items-center justify-between px-0 py-4">
                        <li className="text-left">
                            <span className="text-sm text-gray-400">Price</span>
                            <p className="m-0 text-xl font-bold text-gray-900">Rs. {props.rate ?? "—"}</p>
                        </li>
                        <li className="text-left">
                            <span className="text-sm text-gray-400">Min Order</span>
                            <p className="m-0 font-medium">{props.minOrder}</p>
                        </li>
                    </ul>

                    <div className="pt-4">
                        <Link href={`/product-display/${props.id}`} className="block w-full">
                            <span className="inline-block cursor-pointer select-none rounded-full border border-mainBgColor bg-mainBgColor px-3 py-2 text-center align-middle text-sm font-semibold leading-normal text-white no-underline shadow-sm w-full">
                                View More
                            </span>
                        </Link>
                    </div>
                </div>
            </article>
        </>
    )
}

export default SingleProductCard