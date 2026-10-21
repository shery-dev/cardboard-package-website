import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import MaterialForm from "@/components/Dashboard/Forms/MaterialForm"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Cost Estimation Attributes"}
                    component={
                        <MaterialForm />
                    }
                />
            </div>
        </>
    )
}

export default page