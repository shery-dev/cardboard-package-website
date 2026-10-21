import ReelContainer from "@/components/Dashboard/TableContainer/ReelContainer"
import TableContainer from "@/components/Dashboard/TableContainer/TableContainer"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <TableContainer
                    heading={'Reels Attributes'}
                    table={ <ReelContainer /> }
                />
            </div>
        </>
    )
}

export default page