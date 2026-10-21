import MainTypeCard from "../MainTypeCard"

const RollTypesList = (props) => {

    const products = props?.data?.data;
    return (
        <>
            <div className="mx-auto grid max-w-screen-lg justify-center px-4 sm:grid-cols-2 sm:gap-4 sm:px-8 md:grid-cols-3">
                {
                    products?.map((product)=>(
                        <MainTypeCard
                            key={product._id}
                            id={product._id}
                            itemType={"roll"}
                            heading={product.Type}
                            introPara={product.description}
                            imgSrc={product.images[0]}
                            stock={product.Quantity}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default RollTypesList