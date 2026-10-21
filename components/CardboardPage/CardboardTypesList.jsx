import MainTypeCard from "../MainTypeCard"

const CardboardTypesList = (props) => {
    const products = props.prodTypes;
    return (
        <>
            <div className="mx-auto grid max-w-screen-lg px-4 justify-center  sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
                {
                    products?.map((product)=>(
                        <MainTypeCard
                            key={product._id}
                            id={product._id}
                            itemType={"box"}
                            heading={product.cardboardname}
                            introPara={product.description}
                            imgSrc={product.img?.[0]?.startsWith("/") ? product.img[0] : `/api/v1/fetchImg/${product.img?.[0] ?? ""}`}
                            stock={"In Stock"}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default CardboardTypesList