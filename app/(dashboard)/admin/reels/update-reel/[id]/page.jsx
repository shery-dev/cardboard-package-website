import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import ReelUpdateForm from "@/components/Dashboard/Forms/ReelUpdateForm"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Reel Details"}
                    component={
                        <ReelUpdateForm />
                    }
                />
            </div>
        </>
    )
}

export default page