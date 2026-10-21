import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import StockOutRollForm from "@/components/Dashboard/Forms/StockOutRollForm"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Roll Stock Out"}
                    component={
                        <StockOutRollForm />
                    }
                />
            </div>
        </>
    )
}

export default page