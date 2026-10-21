import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import StockOutReelsForm from "@/components/Dashboard/Forms/StockOutReelsForm"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Reels Stock Out"}
                    component={
                        <StockOutReelsForm />
                    }
                />
            </div>
        </>
    )
}

export default page