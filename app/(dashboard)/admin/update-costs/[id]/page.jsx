import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import CostForm from "@/components/Dashboard/Forms/CostForm"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Cost Estimation Attributes"}
                    component={
                        <CostForm />
                    }
                />
            </div>
        </>
    )
}

export default page