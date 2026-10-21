import DashboardFormContainer from "@/components/Dashboard/DashboardFormContainer/DashboardFormContainer"
import RollUpdateForm from "@/components/Dashboard/Forms/RollUpdateForm"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <DashboardFormContainer
                    heading={"Roll Details"}
                    component={
                        <RollUpdateForm />
                    }
                />
            </div>
        </>
    )
}

export default page