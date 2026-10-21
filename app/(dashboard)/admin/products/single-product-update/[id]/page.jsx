import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import ProductForm from "@/components/Dashboard/Forms/ProductForm"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Product Details"}
                    component={
                        <ProductForm />
                    }
                />
            </div>
        </>
    )
}

export default page