import MainTypeCard from "../MainTypeCard"

const ReeTypesList = ({data}) => {
    const products = data;
    return (
        <>
            <div className="mx-auto grid max-w-screen-lg justify-center px-4 sm:grid-cols-2 sm:gap-4 sm:px-8 md:grid-cols-3">
                {
                    products?.map((product)=>(
                        <MainTypeCard
                            key={product?._id}
                            id={product?._id}
                            itemType={"reel"}
                            heading={product?.Type}
                            introPara={product?.description}
                            imgSrc={"/img/reels_usage_small_4.png"}
                            stock={product?.Quantity}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default ReeTypesList