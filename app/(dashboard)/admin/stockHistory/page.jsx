import TableContainer from '@/components/Dashboard/TableContainer/TableContainer'
import StockHistoryTable from '@/components/Dashboard/Tables/StockHistoryTable'

const page = () => {
    return (
        <>
            <div className=' flex justify-start items-start flex-col gap-4 py-8 px-4'>
                <TableContainer
                    heading={"Stock History"}
                    table={<StockHistoryTable />}
                />
            </div>
        </>
    )
}

export default page