import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import StockInRollForm from "@/components/Dashboard/Forms/StockInRollForm"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Roll Stock In"}
                    component={
                        <StockInRollForm />
                    }
                />
            </div>
        </>
    )
}

export default page