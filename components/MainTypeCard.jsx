import Image from "next/image"
import Link from "next/link"
import { RiStockFill } from "react-icons/ri";

const MainTypeCard = (props) => {

    const pageRedirect = (type) => {
        if (type === 'box') {
            return `cardboard/products-list/${props.id}`
        } else if (type === 'roll') {
            return `/rolls-display/${props.id}`
        } else {
            return `/reels-display/${props.id}`
        }
    }
    return (
        <>
            <article className=" h-[600px] mx-auto my-4 w-full flex flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white text-gray-900 transition hover:translate-y-2 hover:shadow-lg">
                <Link
                    href={pageRedirect(props.itemType)}
                    className=" h-full"
                    
                >
                    <Image
                        height={200}
                        width={200}
                        src={props.imgSrc}
                        className="h-1/2 w-full object-cover"
                        alt="" />
                    <div className=" px-6 py-5 h-1/2 flex justify-between flex-col">
                        <span className=" h-full">
                            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-400">
                                <span className=" text-lg"><RiStockFill /></span>
                                {props.stock <= 0 ? "Out-Stock" : "In-Stock"}
                            </span>
                            <h3 className="mt-4 mb-3 text-xl text-headingTxtColor font-semibold xl:text-2xl">{props.heading}</h3>
                            <p className=" text-base font-light text-justify overflow-hidden h-[55%] ">{props.introPara}</p>
                        </span>
                        <span
                            className="inline-block cursor-pointer select-none rounded-full border border-mainBgColor bg-mainBgColor px-3 py-2 text-center align-middle text-sm font-semibold leading-normal text-white no-underline shadow-sm w-full"
                        >
                            View Products
                        </span>
                    </div>
                </Link>
            </article>
        </>
    )
}

export default MainTypeCard