import SingleProductCard from "../SingleProductCard"

const CardboardSPL = (props) => {
    const products = props.data;
    return (
        <>
            <div className="mx-auto grid max-w-screen-lg justify-center px-4 sm:grid-cols-2 sm:gap-4 sm:px-8 md:grid-cols-3">
                {
                    products?.map((product)=>(
                        <SingleProductCard
                            key={product._id}
                            id={product._id}
                            heading={product.cardboardname}
                            minOrder={product.minOrder}
                            imgSrc={product.images?.[0]}
                            dimensions={product.dimensions}
                            stock={product.quantity}
                            rate={product.rate}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default CardboardSPL