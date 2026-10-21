const ProductsContainer = (props) => {
    return (
        <>
            <section className="py-10">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl text-headingTxtColor font-lora font-bold text-center">{props.heading}</h1>
                <div className=" mt-6">
                    {props.productList}
                </div>
            </section>
        </>
    )
}

export default ProductsContainer