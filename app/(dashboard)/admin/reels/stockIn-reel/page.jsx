import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import StockInReelsForm from "@/components/Dashboard/Forms/StockInReelsFrom"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Reels Stock In"}
                    component={
                        <StockInReelsForm />
                    }
                />
            </div>
        </>
    )
}

export default page