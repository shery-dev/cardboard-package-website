import RollContainer from "@/components/Dashboard/TableContainer/RollContainer"
import TableContainer from "@/components/Dashboard/TableContainer/TableContainer"

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <TableContainer
                    heading={'Rolls Attributes'}
                    table={ <RollContainer /> }
                />
            </div>
        </>
    )
}

export default page